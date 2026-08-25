<?php

namespace App\Services;

use App\Models\SystemSetting;
use App\Repositories\AssignmentRepository;
use App\Repositories\AuditLogRepository;
use App\Repositories\GradeRepository;
use App\Repositories\InstructorRepository;
use App\Repositories\SectionRepository;
use App\Repositories\StudentRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\ProgramRepository;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class LocalExcelSheetService
{
    protected string $relativeDir = 'sheets';
    protected string $fileName = 'grade_administration_local_sheets.xlsx';

    public function __construct(
        protected StudentRepository $studentRepo,
        protected InstructorRepository $instructorRepo,
        protected SubjectRepository $subjectRepo,
        protected SectionRepository $sectionRepo,
        protected AssignmentRepository $assignmentRepo,
        protected GradeRepository $gradeRepo,
        protected AuditLogRepository $auditRepo,
        protected ProgramRepository $programRepo
    ) {}

    public function isLocalSheetActive(): bool
    {
        return (bool) SystemSetting::getSetting('local_sheet_active', false);
    }

    public function toggleLocalSheet(?bool $status = null): bool
    {
        $newStatus = $status ?? ! $this->isLocalSheetActive();
        SystemSetting::setSetting('local_sheet_active', $newStatus);

        if ($newStatus) {
            $this->generateLocalExcelFile();
        }

        return $newStatus;
    }

    public function getLocalFilePath(): string
    {
        return storage_path('app/' . $this->relativeDir . '/' . $this->fileName);
    }

    public function getLocalFileStats(): array
    {
        $path = $this->getLocalFilePath();
        $exists = file_exists($path);

        if (! $exists) {
            return [
                'active' => $this->isLocalSheetActive(),
                'exists' => false,
                'path' => $path,
                'relative_path' => 'storage/app/' . $this->relativeDir . '/' . $this->fileName,
                'file_size' => '0 KB',
                'last_modified' => 'Never',
            ];
        }

        $bytes = filesize($path);
        $sizeStr = $bytes >= 1048576 
            ? number_format($bytes / 1048576, 2) . ' MB' 
            : number_format($bytes / 1024, 2) . ' KB';

        return [
            'active' => $this->isLocalSheetActive(),
            'exists' => true,
            'path' => $path,
            'relative_path' => 'storage/app/' . $this->relativeDir . '/' . $this->fileName,
            'file_size' => $sizeStr,
            'last_modified' => date('M j, Y g:i A', filemtime($path)),
        ];
    }

    public function generateLocalExcelFile(): bool
    {
        try {
            $sheetsDir = storage_path('app/' . $this->relativeDir);
            if (! is_dir($sheetsDir)) {
                mkdir($sheetsDir, 0755, true);
            }

            $spreadsheet = new Spreadsheet();
            $spreadsheet->removeSheetByIndex(0); // Remove default sheet

            // 0. Programs sheet
            $sheetPrograms = $spreadsheet->createSheet();
            $sheetPrograms->setTitle('programs');
            $this->populateSheet($sheetPrograms, [
                ['id', 'code', 'name', 'description', 'status', 'created_at', 'updated_at']
            ], $this->programRepo->getAll(), function ($prog) {
                return [
                    (string) $prog->id,
                    $prog->code,
                    $prog->name,
                    $prog->description ?? '',
                    $prog->status,
                    $prog->created_at?->toDateTimeString() ?? '',
                    $prog->updated_at?->toDateTimeString() ?? '',
                ];
            });

            // 1. Students sheet
            $sheetStudents = $spreadsheet->createSheet();
            $sheetStudents->setTitle('students');
            $this->populateSheet($sheetStudents, [
                ['id', 'student_id', 'name', 'grade_level', 'section_id', 'school_year', 'status', 'created_at', 'updated_at']
            ], $this->studentRepo->getAll(), function ($st) {
                return [
                    (string) $st->id,
                    $st->student_id,
                    $st->name,
                    $st->grade_level,
                    $st->section,
                    $st->school_year,
                    $st->status,
                    $st->created_at?->toDateTimeString() ?? '',
                    $st->updated_at?->toDateTimeString() ?? '',
                ];
            });

            // 2. Instructors sheet
            $sheetInstructors = $spreadsheet->createSheet();
            $sheetInstructors->setTitle('instructors');
            $this->populateSheet($sheetInstructors, [
                ['id', 'instructor_id', 'name', 'email', 'status', 'created_at', 'updated_at']
            ], $this->instructorRepo->getAll(), function ($inst) {
                return [
                    (string) $inst->id,
                    $inst->instructor_id,
                    $inst->name,
                    $inst->email,
                    $inst->status,
                    $inst->created_at?->toDateTimeString() ?? '',
                    $inst->updated_at?->toDateTimeString() ?? '',
                ];
            });

            // 3. Subjects sheet
            $sheetSubjects = $spreadsheet->createSheet();
            $sheetSubjects->setTitle('subjects');
            $this->populateSheet($sheetSubjects, [
                ['id', 'subject_code', 'subject_name', 'description', 'status']
            ], $this->subjectRepo->getAll(), function ($sub) {
                return [
                    (string) $sub->id,
                    $sub->subject_code,
                    $sub->subject_name,
                    $sub->description ?? '',
                    $sub->status,
                ];
            });

            // 4. Sections sheet
            $sheetSections = $spreadsheet->createSheet();
            $sheetSections->setTitle('sections');
            $this->populateSheet($sheetSections, [
                ['id', 'grade_level', 'section_name', 'school_year', 'status']
            ], $this->sectionRepo->getAll(), function ($sec) {
                return [
                    (string) $sec->id,
                    $sec->grade_level,
                    $sec->section_name,
                    $sec->school_year,
                    $sec->status,
                ];
            });

            // 5. Assignments sheet
            $sheetAssignments = $spreadsheet->createSheet();
            $sheetAssignments->setTitle('assignments');
            $this->populateSheet($sheetAssignments, [
                ['id', 'instructor_id', 'subject_id', 'section_id', 'school_year', 'status', 'created_at']
            ], $this->assignmentRepo->getAll(), function ($asgn) {
                return [
                    (string) $asgn->id,
                    $asgn->instructor_id,
                    $asgn->subject_id,
                    $asgn->section_id,
                    $asgn->school_year,
                    $asgn->status,
                    $asgn->created_at?->toDateTimeString() ?? '',
                ];
            });

            // 6. Grades sheet
            $sheetGrades = $spreadsheet->createSheet();
            $sheetGrades->setTitle('grades');
            $this->populateSheet($sheetGrades, [
                ['id', 'student_id', 'subject_id', 'instructor_id', 'section_id', 'school_year', 'prelim', 'midterm', 'final', 'final_average', 'status', 'created_at', 'updated_at']
            ], $this->gradeRepo->getAll(), function ($grd) {
                return [
                    (string) $grd->id,
                    $grd->student_id,
                    $grd->subject_id,
                    $grd->instructor_id,
                    $grd->section_id,
                    $grd->school_year,
                    $grd->prelim !== null ? (string) $grd->prelim : '',
                    $grd->midterm !== null ? (string) $grd->midterm : '',
                    $grd->final !== null ? (string) $grd->final : '',
                    $grd->final_average !== null ? (string) $grd->final_average : '',
                    $grd->status,
                    $grd->created_at?->toDateTimeString() ?? '',
                    $grd->updated_at?->toDateTimeString() ?? '',
                ];
            });

            // 7. Audit logs sheet
            $sheetAudit = $spreadsheet->createSheet();
            $sheetAudit->setTitle('audit_logs');
            $this->populateSheet($sheetAudit, [
                ['id', 'user_id', 'role', 'grade_id', 'student_id', 'subject_id', 'action', 'old_prelim', 'new_prelim', 'old_midterm', 'new_midterm', 'old_final', 'new_final', 'old_average', 'new_average', 'ip_address', 'created_at']
            ], $this->auditRepo->getAll(), function ($log) {
                return [
                    (string) $log->id,
                    $log->user_id,
                    $log->role,
                    $log->grade_id ?? '',
                    $log->student_id ?? '',
                    $log->subject_id ?? '',
                    $log->action,
                    $log->old_prelim !== null ? (string) $log->old_prelim : '',
                    $log->new_prelim !== null ? (string) $log->new_prelim : '',
                    $log->old_midterm !== null ? (string) $log->old_midterm : '',
                    $log->new_midterm !== null ? (string) $log->new_midterm : '',
                    $log->old_final !== null ? (string) $log->old_final : '',
                    $log->new_final !== null ? (string) $log->new_final : '',
                    $log->old_average !== null ? (string) $log->old_average : '',
                    $log->new_average !== null ? (string) $log->new_average : '',
                    $log->ip_address ?? '',
                    $log->created_at?->toDateTimeString() ?? '',
                ];
            });

            // 8. Admin audit logs sheet
            $sheetAdminAudit = $spreadsheet->createSheet();
            $sheetAdminAudit->setTitle('admin_audit_logs');
            $this->populateSheet($sheetAdminAudit, [
                ['id', 'email', 'user_name', 'role', 'action', 'status', 'details', 'ip_address', 'created_at']
            ], \App\Models\AdminAuditLog::orderBy('created_at', 'desc')->get(), function ($log) {
                return [
                    (string) $log->id,
                    $log->email ?? '',
                    $log->user_name ?? '',
                    $log->role ?? '',
                    $log->action ?? '',
                    $log->status ?? '',
                    $log->details ?? '',
                    $log->ip_address ?? '',
                    $log->created_at?->toDateTimeString() ?? '',
                ];
            });

            // 9. Users sheet
            $sheetUsers = $spreadsheet->createSheet();
            $sheetUsers->setTitle('users');
            $this->populateSheet($sheetUsers, [
                ['id', 'username', 'email', 'password', 'role', 'status', 'profile_id', 'created_at', 'updated_at']
            ], \App\Models\User::all(), function ($u) {
                return [
                    (string) $u->id,
                    $u->name,
                    $u->email,
                    $u->password,
                    $u->role,
                    $u->status,
                    $u->profile_id ?? '',
                    $u->created_at?->toDateTimeString() ?? '',
                    $u->updated_at?->toDateTimeString() ?? '',
                ];
            });

            $spreadsheet->setActiveSheetIndex(0);

            $writer = new Xlsx($spreadsheet);
            $filePath = $this->getLocalFilePath();
            $writer->save($filePath);

            Log::info("Local Excel sheet created/updated successfully at {$filePath}");
            return true;
        } catch (Exception $e) {
            Log::error("Failed to generate local Excel sheet: " . $e->getMessage());
            return false;
        }
    }

    protected function populateSheet($worksheet, array $headers, $collection, callable $rowMapper): void
    {
        $worksheet->fromArray($headers, null, 'A1');
        $rowIndex = 2;
        foreach ($collection as $item) {
            $rowValues = $rowMapper($item);
            $worksheet->fromArray([$rowValues], null, 'A' . $rowIndex);
            $rowIndex++;
        }
    }
}
