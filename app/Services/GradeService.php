<?php

namespace App\Services;

use App\Models\Grade;
use App\Models\User;
use App\Repositories\GradeRepository;
use App\Repositories\AuditLogRepository;
use App\Repositories\AssignmentRepository;
use Illuminate\Validation\ValidationException;
use Exception;

class GradeService
{
    public function __construct(
        protected GradeRepository $gradeRepo,
        protected AuditLogRepository $auditRepo,
        protected AssignmentRepository $assignmentRepo
    ) {}

    /**
     * Validate numeric grade inputs (0 - 100).
     */
    public function validateGradeValue(?float $val, string $fieldName = 'Grade'): ?float
    {
        if ($val === null) {
            return null;
        }

        if ($val < 0 || $val > 100) {
            throw ValidationException::withMessages([
                $fieldName => ["{$fieldName} must be a number between 0 and 100."]
            ]);
        }

        return round($val, 2);
    }

    /**
     * Calculate Final Average using custom percentage weights.
     */
    public function calculateFinalAverage(
        ?float $prelim,
        ?float $midterm,
        ?float $final,
        float $pw = 30.0,
        float $mw = 30.0,
        float $fw = 40.0
    ): ?float {
        if ($prelim === null || $midterm === null || $final === null) {
            return null;
        }

        $totalWeight = $pw + $mw + $fw;
        if ($totalWeight <= 0) {
            $totalWeight = 100.0;
        }

        $average = ($prelim * ($pw / $totalWeight)) + ($midterm * ($mw / $totalWeight)) + ($final * ($fw / $totalWeight));
        return round($average, 2);
    }

    /**
     * Determine Grade Status: Passed (>= 75) or Failed (< 75).
     */
    public function calculateStatus(?float $average): string
    {
        if ($average === null) {
            return 'Pending';
        }

        return $average >= 75.0 ? 'Passed' : 'Failed';
    }

    /**
     * Encode and update grade with automated calculations and audit trail.
     */
    public function encodeGrade(
        User $user,
        array $data,
        ?string $ipAddress = null
    ): Grade {
        // Enforce global grade submission disable settings
        if (\App\Models\SystemSetting::isGradeSubmissionDisabled()) {
            $setting = \App\Models\SystemSetting::getSetting('grade_submission');
            $msg = !empty($setting['message']) ? $setting['message'] : 'Grade submission is currently disabled by the administration.';
            throw new Exception($msg);
        }

        // Enforce authorization if user is an instructor
        if ($user->isInstructor()) {
            $isAssigned = $this->assignmentRepo->isAssigned(
                $user->email,
                $data['subject_id'],
                $data['section_id'],
                $data['school_year']
            );

            if (!$isAssigned) {
                if (($data['instructor_id'] ?? '') !== $user->email && ($data['instructor_id'] ?? '') !== (string)$user->id) {
                    throw new Exception('Unauthorized: You are not assigned to encode grades for this class.');
                }
            }
        }

        // Fetch existing grade for audit & locked check
        $existing = $this->gradeRepo->findGrade(
            $data['student_id'],
            $data['subject_id'],
            $data['section_id'],
            $data['school_year']
        );

        if ($existing && $existing->status === 'Passed' && !$user->isAdmin()) {
            throw new Exception("Cannot modify grade: This student's grade has already been Passed and locked.");
        }

        // Fetch assignment to retrieve custom weights if configured
        $assignment = \App\Models\Assignment::where('subject_id', $data['subject_id'])
            ->where('section_id', $data['section_id'])
            ->first();

        $pw = $assignment->prelim_weight ?? 30.0;
        $mw = $assignment->midterm_weight ?? 30.0;
        $fw = $assignment->final_weight ?? 40.0;

        $prelim = $this->validateGradeValue($data['prelim'] ?? null, 'Prelim Grade');
        $midterm = $this->validateGradeValue($data['midterm'] ?? null, 'Midterm Grade');
        $final = $this->validateGradeValue($data['final'] ?? null, 'Final Grade');

        $average = $this->calculateFinalAverage($prelim, $midterm, $final, $pw, $mw, $fw);
        $status = $this->calculateStatus($average);

        $oldPrelim = $existing?->prelim;
        $oldMidterm = $existing?->midterm;
        $oldFinal = $existing?->final;
        $oldAverage = $existing?->final_average;

        // Save Grade
        $grade = $this->gradeRepo->createOrUpdate(
            [
                'student_id' => $data['student_id'],
                'subject_id' => $data['subject_id'],
                'section_id' => $data['section_id'],
                'school_year' => $data['school_year'],
            ],
            [
                'instructor_id' => $data['instructor_id'] ?? $user->email,
                'prelim' => $prelim,
                'midterm' => $midterm,
                'final' => $final,
                'final_average' => $average,
                'status' => $status,
            ]
        );

        // Dispatch Audit Log
        $action = $existing ? 'UPDATE' : 'CREATE';
        if (($data['submit'] ?? false) === true) {
            $action = 'SUBMIT';
        }

        $this->auditRepo->create([
            'user_id' => (string)$user->id,
            'user_name' => $user->name,
            'role' => $user->role ?? 'instructor',
            'grade_id' => (string)$grade->id,
            'student_id' => $grade->student_id,
            'subject_id' => $grade->subject_id,
            'action' => $action,
            'old_prelim' => $oldPrelim,
            'new_prelim' => $prelim,
            'old_midterm' => $oldMidterm,
            'new_midterm' => $midterm,
            'old_final' => $oldFinal,
            'new_final' => $final,
            'old_average' => $oldAverage,
            'new_average' => $average,
            'ip_address' => $ipAddress,
        ]);

        return $grade;
    }
}
