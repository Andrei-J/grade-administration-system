<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Section;
use App\Models\Assignment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    private function resolveStudent($user): Student
    {
        $student = null;
        if ($user->profile_id) {
            $student = Student::where('student_id', $user->profile_id)->first();
        }

        if (!$student && $user->email) {
            $student = Student::where('name', $user->name)->first();
        }

        if (!$student) {
            $studentId = 'STU-' . rand(100000, 999999);
            $student = Student::create([
                'student_id' => $studentId,
                'name' => $user->name,
                'grade_level' => '1st Year',
                'section' => 'BSIT-1A',
                'program' => 'BSAIT',
                'semester' => '1st Semester',
                'school_year' => '2026-2027',
                'status' => 'Active',
            ]);
            $user->profile_id = $studentId;
            $user->save();
        }

        return $student;
    }

    private function getSectionIdentifiers(Student $student): array
    {
        if (empty($student->section)) {
            return [];
        }

        $sectionObjs = Section::whereRaw('LOWER(section_name) = ?', [strtolower($student->section)])->get();
        $ids = [$student->section];
        foreach ($sectionObjs as $s) {
            $ids[] = (string)$s->id;
            $ids[] = $s->section_name;
        }

        return array_values(array_unique($ids));
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $student = $this->resolveStudent($user);

        $sectionIdentifiers = $this->getSectionIdentifiers($student);

        // Fetch active instructor assignments matching student's section ONLY
        $sectionAssignments = empty($sectionIdentifiers)
            ? collect()
            : Assignment::with(['subject', 'instructor'])
                ->whereIn('section_id', $sectionIdentifiers)
                ->where('status', 'Active')
                ->get();

        // Enrolled grades for this student
        $grades = Grade::with(['subject', 'instructor'])
            ->where('student_id', $student->student_id)
            ->get();

        $enrolledSubjectCodes = $grades->pluck('subject_id')->toArray();

        $enrolledSubjects = $grades->map(function ($g) {
            return [
                'id' => (string)$g->id,
                'code' => $g->subject?->subject_code ?? $g->subject_id,
                'name' => $g->subject?->subject_name ?? $g->subject_id,
                'description' => $g->subject?->description ?? '',
                'instructor' => $g->instructor_name,
                'final_average' => $g->final_average ? number_format((float)$g->final_average, 2) : 'N/A',
                'status' => $g->final_average ? ($g->final_average >= 75 ? 'Passed' : 'Failed') : 'Enrolled',
            ];
        });

        // Determine error message for invalid/empty section or no assigned subjects
        $errorMessage = null;
        if (empty($student->section)) {
            $errorMessage = 'Incorrect section. Please contact Admin.';
        } else {
            $sectionExists = Section::whereRaw('LOWER(section_name) = ?', [strtolower($student->section)])->exists();
            if (!$sectionExists && $sectionAssignments->isEmpty()) {
                $errorMessage = 'Incorrect section. Please contact Admin.';
            } else if ($sectionAssignments->isEmpty()) {
                $errorMessage = 'No subjects found for your section. Please contact Admin.';
            }
        }

        // Available subjects for enrollment - ONLY professor's subjects assigned to student's section
        $availableSubjects = $sectionAssignments->map(function ($a) use ($enrolledSubjectCodes) {
            $code = $a->subject?->subject_code ?? $a->subject_id;
            return [
                'id' => (string)$a->id,
                'subject_code' => $code,
                'subject_name' => $a->subject?->subject_name ?? $code,
                'description' => $a->subject?->description ?? '',
                'instructor' => $a->instructor_name,
                'is_already_enrolled' => in_array($code, $enrolledSubjectCodes),
            ];
        })->values();

        return Inertia::render('student/subjects/index', [
            'studentInfo' => [
                'name' => $student->name,
                'student_id' => $student->student_id,
                'section' => $student->section,
                'grade_level' => $student->grade_level,
                'program' => $student->program ?? 'BSAIT',
                'semester' => $student->semester ?? '1st Semester',
            ],
            'subjects' => $enrolledSubjects,
            'availableSubjects' => $availableSubjects,
            'errorMessage' => $errorMessage,
        ]);
    }

    public function enroll(Request $request)
    {
        $validated = $request->validate([
            'subject_code' => 'required|string|max:50',
        ]);

        $user = $request->user();
        $student = $this->resolveStudent($user);
        $code = trim($validated['subject_code']);

        $sectionIdentifiers = $this->getSectionIdentifiers($student);

        if (empty($sectionIdentifiers)) {
            return redirect()->back()->with('error', 'Incorrect section. Please contact Admin.');
        }

        // Search active professor assignment for student's section matching subject code or name
        $assignment = Assignment::with(['subject', 'instructor'])
            ->whereIn('section_id', $sectionIdentifiers)
            ->where('status', 'Active')
            ->where(function ($q) use ($code) {
                $q->where('subject_id', $code)
                  ->orWhereHas('subject', function ($sq) use ($code) {
                      $sq->whereRaw('LOWER(subject_code) = ?', [strtolower($code)])
                        ->orWhereRaw('LOWER(subject_name) = ?', [strtolower($code)]);
                  });
            })
            ->first();

        if (!$assignment) {
            return redirect()->back()->with('error', "Subject '{$code}' is not available for your section ({$student->section}). Please contact Admin if your section is incorrect.");
        }

        $subjectCode = $assignment->subject?->subject_code ?? $assignment->subject_id;
        $subjectName = $assignment->subject?->subject_name ?? $subjectCode;

        // Check if student is already enrolled in Grade table
        $alreadyEnrolled = Grade::where('student_id', $student->student_id)
            ->where('subject_id', $subjectCode)
            ->exists();

        if ($alreadyEnrolled) {
            return redirect()->back()->with('error', "You are already enrolled in {$subjectName} ({$subjectCode}).");
        }

        Grade::create([
            'student_id' => $student->student_id,
            'subject_id' => $subjectCode,
            'instructor_id' => $assignment->instructor_id,
            'section_id' => $assignment->section_id,
            'school_year' => $assignment->school_year ?? $student->school_year ?? '2026-2027',
            'prelim' => null,
            'midterm' => null,
            'final' => null,
            'final_average' => null,
            'status' => 'Enrolled',
            'sync_status' => 'pending',
        ]);

        return redirect()->back()->with('success', "Successfully enrolled in {$subjectName} ({$subjectCode})!");
    }
}

