<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\StudentRepository;
use App\Repositories\SectionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function __construct(
        protected StudentRepository $studentRepo,
        protected SectionRepository $sectionRepo
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'grade_level', 'section', 'school_year']);
        $students = $this->studentRepo->getAll($filters);
        $sections = $this->sectionRepo->getAll();

        return Inertia::render('admin/students/index', [
            'students' => $students,
            'sections' => $sections,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string|unique:students,student_id',
            'name' => 'required|string|max:255',
            'grade_level' => 'required|string|max:50',
            'section' => 'required|string|max:50',
            'school_year' => 'required|string|max:20',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $this->studentRepo->create($validated);

        return redirect()->back()->with('success', 'Student record created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $student = $this->studentRepo->findById($id);
        if (!$student) {
            return redirect()->back()->with('error', 'Student not found.');
        }

        $validated = $request->validate([
            'student_id' => 'required|string|unique:students,student_id,' . $id,
            'name' => 'required|string|max:255',
            'grade_level' => 'required|string|max:50',
            'section' => 'required|string|max:50',
            'school_year' => 'required|string|max:20',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $this->studentRepo->update($student, $validated);

        return redirect()->back()->with('success', 'Student record updated successfully.');
    }

    public function destroy(int $id)
    {
        $student = $this->studentRepo->findById($id);
        if ($student) {
            $this->studentRepo->delete($student);
        }

        return redirect()->back()->with('success', 'Student record deleted successfully.');
    }
}
