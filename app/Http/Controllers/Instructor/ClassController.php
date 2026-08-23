<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Repositories\AssignmentRepository;
use App\Repositories\StudentRepository;
use App\Repositories\GradeRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\SectionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClassController extends Controller
{
    public function __construct(
        protected AssignmentRepository $assignmentRepo,
        protected StudentRepository $studentRepo,
        protected GradeRepository $gradeRepo,
        protected SubjectRepository $subjectRepo,
        protected SectionRepository $sectionRepo
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $assignments = $this->assignmentRepo->getForInstructor($user->email);

        if ($assignments->isEmpty()) {
            $assignments = $this->assignmentRepo->getAll()->filter(function ($a) use ($user) {
                return $a->instructor_id === $user->email || $a->instructor_id === (string)$user->id || ($a->instructor && $a->instructor->email === $user->email);
            });
        }

        return Inertia::render('instructor/classes/index', [
            'classes' => $assignments->values(),
        ]);
    }

    public function show(Request $request, int $assignmentId): Response
    {
        $user = $request->user();
        $assignment = $this->assignmentRepo->getAll()->firstWhere('id', $assignmentId);

        if (!$assignment) {
            abort(404, 'Class assignment not found.');
        }

        // Server-side authorization check (IDOR protection)
        if ($user->isInstructor() && $assignment->instructor_id !== $user->email && $assignment->instructor_id !== (string)$user->id && ($assignment->instructor?->email !== $user->email)) {
            abort(403, 'Unauthorized access to class assignment.');
        }

        // Fetch students belonging to section
        $students = $this->studentRepo->getAll([
            'section' => $assignment->section_id,
            'school_year' => $assignment->school_year,
        ]);

        // If no student filter matched, get all students matching section name
        if ($students->isEmpty()) {
            $students = $this->studentRepo->getAll();
        }

        // Fetch existing grades for this subject and section
        $grades = $this->gradeRepo->getAll([
            'subject_id' => $assignment->subject_id,
            'section_id' => $assignment->section_id,
            'school_year' => $assignment->school_year,
        ])->keyBy('student_id');

        return Inertia::render('instructor/classes/show', [
            'assignment' => $assignment,
            'students' => $students,
            'grades' => $grades,
        ]);
    }
}
