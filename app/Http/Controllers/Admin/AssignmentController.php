<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\Student;
use App\Models\SystemSetting;
use App\Models\SectionSubject;
use App\Repositories\AssignmentRepository;
use App\Repositories\InstructorRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\SectionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssignmentController extends Controller
{
    public function __construct(
        protected AssignmentRepository $assignmentRepo,
        protected InstructorRepository $instructorRepo,
        protected SubjectRepository $subjectRepo,
        protected SectionRepository $sectionRepo
    ) {}

    public function index(): Response
    {
        $assignments = $this->assignmentRepo->getAll();
        $instructors = $this->instructorRepo->getAll();
        $subjects = $this->subjectRepo->getAll();
        $sections = $this->sectionRepo->getAll();
        $students = Student::orderBy('name')->get();

        $gradeSubmissionSettings = SystemSetting::getSetting('grade_submission', [
            'is_disabled' => false,
            'disable_at' => null,
            'enable_at' => null,
            'message' => 'Grade submission is currently disabled by the administration.',
        ]);

        $isSubmissionDisabled = SystemSetting::isGradeSubmissionDisabled();

        return Inertia::render('admin/assignments/index', [
            'assignments' => $assignments,
            'instructors' => $instructors,
            'subjects' => $subjects,
            'sections' => $sections,
            'students' => $students,
            'gradeSubmissionSettings' => $gradeSubmissionSettings,
            'isSubmissionDisabled' => $isSubmissionDisabled,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'instructor_id' => 'required|string',
            'pairings' => 'nullable|array',
            'pairings.*.section_id' => 'required_with:pairings|string',
            'pairings.*.subject_ids' => 'required_with:pairings|array',
            'pairings.*.subject_ids.*' => 'string',
            'section_id' => 'nullable|string',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'string',
            'subject_id' => 'nullable|string',
            'school_year' => 'required|string|max:20',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $pairings = $request->input('pairings', []);

        // Fallback for single section selection submission
        if (empty($pairings) && $request->filled('section_id')) {
            $secId = $request->input('section_id');
            $subIds = $request->input('subject_ids');
            if (empty($subIds) && $request->filled('subject_id')) {
                $subIds = [$request->input('subject_id')];
            }
            if (!empty($subIds)) {
                $pairings[] = [
                    'section_id' => $secId,
                    'subject_ids' => $subIds,
                ];
            }
        }

        if (empty($pairings)) {
            return redirect()->back()->with('error', 'Please select a section and at least one subject for that section.');
        }

        $assignedCount = 0;
        foreach ($pairings as $pair) {
            $secId = $pair['section_id'];
            $subIds = $pair['subject_ids'] ?? [];

            foreach ($subIds as $subId) {
                // Ensure section-subject relationship record exists
                SectionSubject::firstOrCreate([
                    'section_id' => $secId,
                    'subject_id' => $subId,
                ]);

                $existing = $this->assignmentRepo->findAssignment(
                    $validated['instructor_id'],
                    $subId,
                    $secId,
                    $validated['school_year']
                );

                if (!$existing) {
                    $this->assignmentRepo->create([
                        'instructor_id' => $validated['instructor_id'],
                        'subject_id' => $subId,
                        'section_id' => $secId,
                        'school_year' => $validated['school_year'],
                        'status' => $validated['status'],
                    ]);
                    $assignedCount++;
                } else {
                    $this->assignmentRepo->update($existing, [
                        'status' => $validated['status'],
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', "Instructor successfully assigned to {$assignedCount} class pairing(s).");
    }

    public function update(Request $request, int $id)
    {
        $assignment = $this->assignmentRepo->getAll()->firstWhere('id', $id);
        if (!$assignment) {
            return redirect()->back()->with('error', 'Assignment not found.');
        }

        $validated = $request->validate([
            'instructor_id' => 'required|string',
            'subject_id' => 'required|string',
            'section_id' => 'required|string',
            'school_year' => 'required|string|max:20',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        SectionSubject::firstOrCreate([
            'section_id' => $validated['section_id'],
            'subject_id' => $validated['subject_id'],
        ]);

        $this->assignmentRepo->update($assignment, $validated);

        return redirect()->back()->with('success', 'Assignment updated successfully.');
    }

    public function addIrregularStudent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string|exists:students,student_id',
            'subject_id' => 'required|string',
            'instructor_id' => 'required|string',
            'section_id' => 'required|string',
            'school_year' => 'nullable|string',
        ]);

        $student = Student::where('student_id', $validated['student_id'])->firstOrFail();

        $alreadyEnrolled = \App\Models\Grade::where('student_id', $student->student_id)
            ->where('subject_id', $validated['subject_id'])
            ->exists();

        if ($alreadyEnrolled) {
            return redirect()->back()->with('error', "Student {$student->name} ({$student->student_id}) is already enrolled in subject {$validated['subject_id']}.");
        }

        \App\Models\Grade::create([
            'student_id' => $student->student_id,
            'subject_id' => $validated['subject_id'],
            'instructor_id' => $validated['instructor_id'],
            'section_id' => $validated['section_id'],
            'school_year' => $validated['school_year'] ?? '2026-2027',
            'status' => 'Enrolled',
            'sync_status' => 'pending',
        ]);

        AdminAuditLog::create([
            'email' => $request->user()?->email,
            'user_name' => $request->user()?->name,
            'role' => 'admin',
            'action' => 'ADD_IRREGULAR_STUDENT',
            'status' => 'SUCCESS',
            'details' => "Enrolled irregular student {$student->name} ({$student->student_id} from section {$student->section}) into subject {$validated['subject_id']}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', "Irregular student {$student->name} ({$student->student_id} - Section: {$student->section}) successfully enrolled into {$validated['subject_id']}!");
    }

    public function updateGradeSubmissionSettings(Request $request)
    {
        $validated = $request->validate([
            'is_disabled' => 'required|boolean',
            'disable_at' => 'nullable|string',
            'enable_at' => 'nullable|string',
            'message' => 'nullable|string|max:500',
        ]);

        SystemSetting::setSetting('grade_submission', $validated);

        AdminAuditLog::create([
            'email' => $request->user()?->email,
            'user_name' => $request->user()?->name,
            'role' => 'admin',
            'action' => 'UPDATE_GRADE_SUBMISSION_SETTINGS',
            'status' => 'SUCCESS',
            'details' => "Updated grade submission control settings. Disabled: " . ($validated['is_disabled'] ? 'YES' : 'NO') . ", Scheduled Disable: " . ($validated['disable_at'] ?? 'None') . ", Scheduled Re-enable: " . ($validated['enable_at'] ?? 'None'),
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Grade submission control settings updated successfully.');
    }
}
