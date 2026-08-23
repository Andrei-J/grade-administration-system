<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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

        return Inertia::render('admin/assignments/index', [
            'assignments' => $assignments,
            'instructors' => $instructors,
            'subjects' => $subjects,
            'sections' => $sections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'instructor_id' => 'required|string',
            'subject_id' => 'required|string',
            'section_id' => 'required|string',
            'school_year' => 'required|string|max:20',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $this->assignmentRepo->create($validated);

        return redirect()->back()->with('success', 'Instructor assigned successfully.');
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

        $this->assignmentRepo->update($assignment, $validated);

        return redirect()->back()->with('success', 'Assignment updated successfully.');
    }
}
