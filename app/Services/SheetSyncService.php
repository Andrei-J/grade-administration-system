<?php

namespace App\Services;

use App\Repositories\StudentRepository;
use App\Repositories\InstructorRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\SectionRepository;
use App\Repositories\AssignmentRepository;
use App\Repositories\GradeRepository;
use App\Repositories\AuditLogRepository;
use App\Repositories\SyncLogRepository;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Support\Facades\Log;

class SheetSyncService
{
    public function __construct(
        protected GoogleSheetsService $googleSheets,
        protected StudentRepository $studentRepo,
        protected InstructorRepository $instructorRepo,
        protected SubjectRepository $subjectRepo,
        protected SectionRepository $sectionRepo,
        protected AssignmentRepository $assignmentRepo,
        protected GradeRepository $gradeRepo,
        protected AuditLogRepository $auditRepo,
        protected SyncLogRepository $syncLogRepo,
        protected UserRepository $userRepo,
        protected GradeService $gradeService
    ) {}

    public function pullFromGoogle(?int $userId = null): array
    {
        $summary = [
            'Added' => 0,
            'Updated' => 0,
            'Deleted' => 0,
            'Conflicts' => 0,
            'Failed' => 0,
        ];

        if (!$this->googleSheets->isConfigured()) {
            $summary['Failed']++;
            $this->syncLogRepo->create([
                'user_id' => $userId ? (string)$userId : null,
                'direction' => 'GOOGLE_TO_LOCAL',
                'action' => 'PULL',
                'status' => 'Failed',
                'error_message' => 'Google Sheets Service Account Credentials not configured or missing.',
            ]);

            return [
                'success' => false,
                'message' => 'Google Sheets API connection unavailable. Using local offline storage.',
                'summary' => $summary,
            ];
        }

        try {
            // Pull Students
            $this->pullStudents($summary);
            // Pull Instructors
            $this->pullInstructors($summary);
            // Pull Subjects
            $this->pullSubjects($summary);
            // Pull Sections
            $this->pullSections($summary);
            // Pull Assignments
            $this->pullAssignments($summary);
            // Pull Grades
            $this->pullGrades($summary);

            $this->syncLogRepo->create([
                'user_id' => $userId ? (string)$userId : null,
                'direction' => 'GOOGLE_TO_LOCAL',
                'action' => 'PULL',
                'status' => 'Success',
                'records_count' => $summary['Added'] + $summary['Updated'],
                'details' => json_encode($summary),
            ]);

            return [
                'success' => true,
                'message' => 'Successfully synchronized from Google Sheets.',
                'summary' => $summary,
            ];
        } catch (Exception $e) {
            Log::error('Pull from Google Sheets failed: ' . $e->getMessage());
            $summary['Failed']++;

            $this->syncLogRepo->create([
                'user_id' => $userId ? (string)$userId : null,
                'direction' => 'GOOGLE_TO_LOCAL',
                'action' => 'PULL',
                'status' => 'Failed',
                'error_message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage(),
                'summary' => $summary,
            ];
        }
    }

    public function pushToGoogle(?int $userId = null): array
    {
        $summary = [
            'Uploaded' => 0,
            'Updated' => 0,
            'Failed' => 0,
        ];

        if (!$this->googleSheets->isConfigured()) {
            $summary['Failed']++;
            $this->syncLogRepo->create([
                'user_id' => $userId ? (string)$userId : null,
                'direction' => 'LOCAL_TO_GOOGLE',
                'action' => 'PUSH',
                'status' => 'Failed',
                'error_message' => 'Google Sheets Service Account Credentials not configured or missing.',
            ]);

            return [
                'success' => false,
                'message' => 'Google Sheets API connection unavailable. Changes saved locally as pending.',
                'summary' => $summary,
            ];
        }

        try {
            // Push Students
            $this->pushStudents($summary);
            // Push Instructors
            $this->pushInstructors($summary);
            // Push Subjects
            $this->pushSubjects($summary);
            // Push Sections
            $this->pushSections($summary);
            // Push Assignments
            $this->pushAssignments($summary);
            // Push Grades
            $this->pushGrades($summary);
            // Push Audit Logs
            $this->pushAuditLogs($summary);

            $this->syncLogRepo->create([
                'user_id' => $userId ? (string)$userId : null,
                'direction' => 'LOCAL_TO_GOOGLE',
                'action' => 'PUSH',
                'status' => 'Success',
                'records_count' => $summary['Uploaded'] + $summary['Updated'],
                'details' => json_encode($summary),
            ]);

            return [
                'success' => true,
                'message' => 'Successfully pushed local pending changes to Google Sheets.',
                'summary' => $summary,
            ];
        } catch (Exception $e) {
            Log::error('Push to Google Sheets failed: ' . $e->getMessage());
            $summary['Failed']++;

            $this->syncLogRepo->create([
                'user_id' => $userId ? (string)$userId : null,
                'direction' => 'LOCAL_TO_GOOGLE',
                'action' => 'PUSH',
                'status' => 'Failed',
                'error_message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Push failed: ' . $e->getMessage(),
                'summary' => $summary,
            ];
        }
    }

    public function syncBothWays(?int $userId = null): array
    {
        $pullResult = $this->pullFromGoogle($userId);
        $pushResult = $this->pushToGoogle($userId);

        $combinedSummary = [
            'Pull_Added' => $pullResult['summary']['Added'] ?? 0,
            'Pull_Updated' => $pullResult['summary']['Updated'] ?? 0,
            'Pull_Conflicts' => $pullResult['summary']['Conflicts'] ?? 0,
            'Push_Uploaded' => $pushResult['summary']['Uploaded'] ?? 0,
            'Push_Updated' => $pushResult['summary']['Updated'] ?? 0,
            'Failed' => ($pullResult['summary']['Failed'] ?? 0) + ($pushResult['summary']['Failed'] ?? 0),
        ];

        return [
            'success' => ($pullResult['success'] ?? false) || ($pushResult['success'] ?? false),
            'message' => 'Bi-directional synchronization complete.',
            'summary' => $combinedSummary,
        ];
    }

    /* ---- Tab Pull Handlers ---- */

    protected function pullStudents(array &$summary): void
    {
        try {
            $rows = $this->googleSheets->getTabValues('students');
            if (empty($rows) || count($rows) <= 1) return;

            $headers = array_map('strtolower', array_map('trim', $rows[0]));
            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                if (empty($row[0])) continue;

                $data = $this->mapRowToHeader($headers, $row);
                $studentId = $data['student_id'] ?? $row[0];
                if (empty($studentId)) continue;

                $existing = $this->studentRepo->findByStudentId($studentId);
                if ($existing) {
                    if ($existing->sync_status === 'pending') {
                        $existing->update(['sync_status' => 'conflict']);
                        $summary['Conflicts']++;
                    } else {
                        $this->studentRepo->update($existing, [
                            'name' => $data['name'] ?? $existing->name,
                            'grade_level' => $data['grade_level'] ?? $existing->grade_level,
                            'section' => $data['section'] ?? $existing->section,
                            'school_year' => $data['school_year'] ?? $existing->school_year,
                            'status' => $data['status'] ?? $existing->status,
                            'sync_status' => 'synced',
                            'synced_at' => now(),
                        ]);
                        $summary['Updated']++;
                    }
                } else {
                    $this->studentRepo->create([
                        'student_id' => $studentId,
                        'name' => $data['name'] ?? 'Unknown',
                        'grade_level' => $data['grade_level'] ?? 'Grade 12',
                        'section' => $data['section'] ?? 'IT-1',
                        'school_year' => $data['school_year'] ?? '2026-2027',
                        'status' => $data['status'] ?? 'Active',
                        'sync_status' => 'synced',
                        'synced_at' => now(),
                    ]);
                    $summary['Added']++;
                }
            }
        } catch (Exception $e) {
            Log::warning('Pull students notice: ' . $e->getMessage());
        }
    }

    protected function pullInstructors(array &$summary): void
    {
        try {
            $rows = $this->googleSheets->getTabValues('instructors');
            if (empty($rows) || count($rows) <= 1) return;

            $headers = array_map('strtolower', array_map('trim', $rows[0]));
            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                if (empty($row[0])) continue;

                $data = $this->mapRowToHeader($headers, $row);
                $instructorId = $data['instructor_id'] ?? $row[0];
                if (empty($instructorId)) continue;

                $existing = $this->instructorRepo->findByInstructorId($instructorId);
                if ($existing) {
                    $this->instructorRepo->update($existing, [
                        'name' => $data['name'] ?? $existing->name,
                        'email' => $data['email'] ?? $existing->email,
                        'status' => $data['status'] ?? $existing->status,
                        'sync_status' => 'synced',
                        'synced_at' => now(),
                    ]);
                    $summary['Updated']++;
                } else {
                    $this->instructorRepo->create([
                        'instructor_id' => $instructorId,
                        'name' => $data['name'] ?? 'Instructor',
                        'email' => $data['email'] ?? "instructor_{$instructorId}@school.edu",
                        'status' => $data['status'] ?? 'Active',
                        'sync_status' => 'synced',
                        'synced_at' => now(),
                    ]);
                    $summary['Added']++;
                }
            }
        } catch (Exception $e) {
            Log::warning('Pull instructors notice: ' . $e->getMessage());
        }
    }

    protected function pullSubjects(array &$summary): void
    {
        try {
            $rows = $this->googleSheets->getTabValues('subjects');
            if (empty($rows) || count($rows) <= 1) return;

            $headers = array_map('strtolower', array_map('trim', $rows[0]));
            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                if (empty($row[0])) continue;

                $data = $this->mapRowToHeader($headers, $row);
                $code = $data['subject_code'] ?? $row[0];
                if (empty($code)) continue;

                $existing = $this->subjectRepo->findByCode($code);
                if ($existing) {
                    $this->subjectRepo->update($existing, [
                        'subject_name' => $data['subject_name'] ?? $existing->subject_name,
                        'description' => $data['description'] ?? $existing->description,
                        'status' => $data['status'] ?? $existing->status,
                        'sync_status' => 'synced',
                        'synced_at' => now(),
                    ]);
                    $summary['Updated']++;
                } else {
                    $this->subjectRepo->create([
                        'subject_code' => $code,
                        'subject_name' => $data['subject_name'] ?? $code,
                        'description' => $data['description'] ?? '',
                        'status' => $data['status'] ?? 'Active',
                        'sync_status' => 'synced',
                        'synced_at' => now(),
                    ]);
                    $summary['Added']++;
                }
            }
        } catch (Exception $e) {
            Log::warning('Pull subjects notice: ' . $e->getMessage());
        }
    }

    protected function pullSections(array &$summary): void
    {
        try {
            $rows = $this->googleSheets->getTabValues('sections');
            if (empty($rows) || count($rows) <= 1) return;

            $headers = array_map('strtolower', array_map('trim', $rows[0]));
            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                if (empty($row[0])) continue;

                $data = $this->mapRowToHeader($headers, $row);
                $name = $data['section_name'] ?? $row[1] ?? 'Section';

                $existing = $this->sectionRepo->getAll()->firstWhere('section_name', $name);
                if ($existing) {
                    $this->sectionRepo->update($existing, [
                        'grade_level' => $data['grade_level'] ?? $existing->grade_level,
                        'school_year' => $data['school_year'] ?? $existing->school_year,
                        'status' => $data['status'] ?? $existing->status,
                        'sync_status' => 'synced',
                        'synced_at' => now(),
                    ]);
                    $summary['Updated']++;
                } else {
                    $this->sectionRepo->create([
                        'grade_level' => $data['grade_level'] ?? 'Grade 12',
                        'section_name' => $name,
                        'school_year' => $data['school_year'] ?? '2026-2027',
                        'status' => $data['status'] ?? 'Active',
                        'sync_status' => 'synced',
                        'synced_at' => now(),
                    ]);
                    $summary['Added']++;
                }
            }
        } catch (Exception $e) {
            Log::warning('Pull sections notice: ' . $e->getMessage());
        }
    }

    protected function pullAssignments(array &$summary): void
    {
        try {
            $rows = $this->googleSheets->getTabValues('assignments');
            if (empty($rows) || count($rows) <= 1) return;

            $headers = array_map('strtolower', array_map('trim', $rows[0]));
            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                if (empty($row[0])) continue;

                $data = $this->mapRowToHeader($headers, $row);
                $instId = $data['instructor_id'] ?? '';
                $subId = $data['subject_id'] ?? '';
                $secId = $data['section_id'] ?? '';
                $sy = $data['school_year'] ?? '2026-2027';

                if (empty($instId) || empty($subId)) continue;

                $existing = $this->assignmentRepo->findAssignment($instId, $subId, $secId, $sy);
                if (!$existing) {
                    $this->assignmentRepo->create([
                        'instructor_id' => $instId,
                        'subject_id' => $subId,
                        'section_id' => $secId,
                        'school_year' => $sy,
                        'status' => $data['status'] ?? 'Active',
                        'sync_status' => 'synced',
                        'synced_at' => now(),
                    ]);
                    $summary['Added']++;
                }
            }
        } catch (Exception $e) {
            Log::warning('Pull assignments notice: ' . $e->getMessage());
        }
    }

    protected function pullGrades(array &$summary): void
    {
        try {
            $rows = $this->googleSheets->getTabValues('grades');
            if (empty($rows) || count($rows) <= 1) return;

            $headers = array_map('strtolower', array_map('trim', $rows[0]));
            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                if (empty($row[0])) continue;

                $data = $this->mapRowToHeader($headers, $row);
                $stId = $data['student_id'] ?? '';
                $sbId = $data['subject_id'] ?? '';
                $scId = $data['section_id'] ?? '';
                $sy = $data['school_year'] ?? '2026-2027';

                if (empty($stId) || empty($sbId)) continue;

                $prelim = isset($data['prelim']) && is_numeric($data['prelim']) ? (float)$data['prelim'] : null;
                $midterm = isset($data['midterm']) && is_numeric($data['midterm']) ? (float)$data['midterm'] : null;
                $final = isset($data['final']) && is_numeric($data['final']) ? (float)$data['final'] : null;

                $average = $this->gradeService->calculateFinalAverage($prelim, $midterm, $final);
                $status = $this->gradeService->calculateStatus($average);

                $existing = $this->gradeRepo->findGrade($stId, $sbId, $scId, $sy);
                if ($existing && $existing->sync_status === 'pending') {
                    $existing->update(['sync_status' => 'conflict']);
                    $summary['Conflicts']++;
                } else {
                    $this->gradeRepo->createOrUpdate(
                        [
                            'student_id' => $stId,
                            'subject_id' => $sbId,
                            'section_id' => $scId,
                            'school_year' => $sy,
                        ],
                        [
                            'instructor_id' => $data['instructor_id'] ?? '',
                            'prelim' => $prelim,
                            'midterm' => $midterm,
                            'final' => $final,
                            'final_average' => $average,
                            'status' => $status,
                            'sync_status' => 'synced',
                            'synced_at' => now(),
                        ]
                    );

                    $summary[$existing ? 'Updated' : 'Added']++;
                }
            }
        } catch (Exception $e) {
            Log::warning('Pull grades notice: ' . $e->getMessage());
        }
    }

    /* ---- Tab Push Handlers ---- */

    protected function pushStudents(array &$summary): void
    {
        $pending = $this->studentRepo->getPendingSync();
        if ($pending->isEmpty()) return;

        $rows = [
            ['id', 'student_id', 'name', 'grade_level', 'section_id', 'school_year', 'status', 'created_at', 'updated_at']
        ];

        foreach ($this->studentRepo->getAll() as $st) {
            $rows[] = [
                (string)$st->id,
                $st->student_id,
                $st->name,
                $st->grade_level,
                $st->section,
                $st->school_year,
                $st->status,
                $st->created_at?->toDateTimeString() ?? '',
                $st->updated_at?->toDateTimeString() ?? '',
            ];
        }

        $this->googleSheets->writeTabValues('students', $rows);
        foreach ($pending as $st) {
            $this->studentRepo->markSynced($st);
            $summary['Uploaded']++;
        }
    }

    protected function pushInstructors(array &$summary): void
    {
        $pending = $this->instructorRepo->getPendingSync();
        if ($pending->isEmpty()) return;

        $rows = [
            ['id', 'instructor_id', 'name', 'email', 'status', 'created_at', 'updated_at']
        ];

        foreach ($this->instructorRepo->getAll() as $inst) {
            $rows[] = [
                (string)$inst->id,
                $inst->instructor_id,
                $inst->name,
                $inst->email,
                $inst->status,
                $inst->created_at?->toDateTimeString() ?? '',
                $inst->updated_at?->toDateTimeString() ?? '',
            ];
        }

        $this->googleSheets->writeTabValues('instructors', $rows);
        foreach ($pending as $inst) {
            $this->instructorRepo->markSynced($inst);
            $summary['Uploaded']++;
        }
    }

    protected function pushSubjects(array &$summary): void
    {
        $pending = $this->subjectRepo->getPendingSync();
        if ($pending->isEmpty()) return;

        $rows = [
            ['id', 'subject_code', 'subject_name', 'description', 'status']
        ];

        foreach ($this->subjectRepo->getAll() as $sub) {
            $rows[] = [
                (string)$sub->id,
                $sub->subject_code,
                $sub->subject_name,
                $sub->description ?? '',
                $sub->status,
            ];
        }

        $this->googleSheets->writeTabValues('subjects', $rows);
        foreach ($pending as $sub) {
            $this->subjectRepo->markSynced($sub);
            $summary['Uploaded']++;
        }
    }

    protected function pushSections(array &$summary): void
    {
        $pending = $this->sectionRepo->getPendingSync();
        if ($pending->isEmpty()) return;

        $rows = [
            ['id', 'grade_level', 'section_name', 'school_year', 'status']
        ];

        foreach ($this->sectionRepo->getAll() as $sec) {
            $rows[] = [
                (string)$sec->id,
                $sec->grade_level,
                $sec->section_name,
                $sec->school_year,
                $sec->status,
            ];
        }

        $this->googleSheets->writeTabValues('sections', $rows);
        foreach ($pending as $sec) {
            $this->sectionRepo->markSynced($sec);
            $summary['Uploaded']++;
        }
    }

    protected function pushAssignments(array &$summary): void
    {
        $pending = $this->assignmentRepo->getPendingSync();
        if ($pending->isEmpty()) return;

        $rows = [
            ['id', 'instructor_id', 'subject_id', 'section_id', 'school_year', 'status', 'created_at']
        ];

        foreach ($this->assignmentRepo->getAll() as $asgn) {
            $rows[] = [
                (string)$asgn->id,
                $asgn->instructor_id,
                $asgn->subject_id,
                $asgn->section_id,
                $asgn->school_year,
                $asgn->status,
                $asgn->created_at?->toDateTimeString() ?? '',
            ];
        }

        $this->googleSheets->writeTabValues('assignments', $rows);
        foreach ($pending as $asgn) {
            $this->assignmentRepo->markSynced($asgn);
            $summary['Uploaded']++;
        }
    }

    protected function pushGrades(array &$summary): void
    {
        $pending = $this->gradeRepo->getPendingSync();
        if ($pending->isEmpty()) return;

        $rows = [
            ['id', 'student_id', 'subject_id', 'instructor_id', 'section_id', 'school_year', 'prelim', 'midterm', 'final', 'final_average', 'status', 'created_at', 'updated_at']
        ];

        foreach ($this->gradeRepo->getAll() as $grd) {
            $rows[] = [
                (string)$grd->id,
                $grd->student_id,
                $grd->subject_id,
                $grd->instructor_id,
                $grd->section_id,
                $grd->school_year,
                $grd->prelim !== null ? (string)$grd->prelim : '',
                $grd->midterm !== null ? (string)$grd->midterm : '',
                $grd->final !== null ? (string)$grd->final : '',
                $grd->final_average !== null ? (string)$grd->final_average : '',
                $grd->status,
                $grd->created_at?->toDateTimeString() ?? '',
                $grd->updated_at?->toDateTimeString() ?? '',
            ];
        }

        $this->googleSheets->writeTabValues('grades', $rows);
        foreach ($pending as $grd) {
            $this->gradeRepo->markSynced($grd);
            $summary['Uploaded']++;
        }
    }

    protected function pushAuditLogs(array &$summary): void
    {
        $pending = $this->auditRepo->getPendingSync();
        if ($pending->isEmpty()) return;

        $rows = [
            ['id', 'user_id', 'role', 'grade_id', 'student_id', 'subject_id', 'action', 'old_prelim', 'new_prelim', 'old_midterm', 'new_midterm', 'old_final', 'new_final', 'old_average', 'new_average', 'ip_address', 'created_at']
        ];

        foreach ($this->auditRepo->getAll() as $log) {
            $rows[] = [
                (string)$log->id,
                $log->user_id,
                $log->role,
                $log->grade_id ?? '',
                $log->student_id ?? '',
                $log->subject_id ?? '',
                $log->action,
                $log->old_prelim !== null ? (string)$log->old_prelim : '',
                $log->new_prelim !== null ? (string)$log->new_prelim : '',
                $log->old_midterm !== null ? (string)$log->old_midterm : '',
                $log->new_midterm !== null ? (string)$log->new_midterm : '',
                $log->old_final !== null ? (string)$log->old_final : '',
                $log->new_final !== null ? (string)$log->new_final : '',
                $log->old_average !== null ? (string)$log->old_average : '',
                $log->new_average !== null ? (string)$log->new_average : '',
                $log->ip_address ?? '',
                $log->created_at?->toDateTimeString() ?? '',
            ];
        }

        $this->googleSheets->writeTabValues('audit_logs', $rows);
        foreach ($pending as $log) {
            $this->auditRepo->markSynced($log);
            $summary['Uploaded']++;
        }
    }

    protected function mapRowToHeader(array $headers, array $row): array
    {
        $data = [];
        foreach ($headers as $idx => $key) {
            $data[$key] = $row[$idx] ?? null;
        }

        return $data;
    }
}
