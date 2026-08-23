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
     * Calculate Final Average: (Prelim + Midterm + Final) / 3 rounded to 2 decimal places.
     */
    public function calculateFinalAverage(?float $prelim, ?float $midterm, ?float $final): ?float
    {
        if ($prelim === null || $midterm === null || $final === null) {
            return null;
        }

        return round(($prelim + $midterm + $final) / 3.0, 2);
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
        // Enforce authorization if user is an instructor
        if ($user->isInstructor()) {
            $isAssigned = $this->assignmentRepo->isAssigned(
                $user->email, // or instructor_id
                $data['subject_id'],
                $data['section_id'],
                $data['school_year']
            );

            // Also check by user's name/email match to instructor_id
            if (!$isAssigned) {
                // Check if instructor_id matches user id or email
                if (($data['instructor_id'] ?? '') !== $user->email && ($data['instructor_id'] ?? '') !== (string)$user->id) {
                    throw new Exception('Unauthorized: You are not assigned to encode grades for this class.');
                }
            }
        }

        $prelim = $this->validateGradeValue($data['prelim'] ?? null, 'Prelim Grade');
        $midterm = $this->validateGradeValue($data['midterm'] ?? null, 'Midterm Grade');
        $final = $this->validateGradeValue($data['final'] ?? null, 'Final Grade');

        $average = $this->calculateFinalAverage($prelim, $midterm, $final);
        $status = $this->calculateStatus($average);

        // Fetch existing grade for audit comparison
        $existing = $this->gradeRepo->findGrade(
            $data['student_id'],
            $data['subject_id'],
            $data['section_id'],
            $data['school_year']
        );

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
