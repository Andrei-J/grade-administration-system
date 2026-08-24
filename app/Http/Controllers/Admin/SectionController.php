<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\SectionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    public function __construct(
        protected SectionRepository $sectionRepo
    ) {}

    public function index(): Response
    {
        $sections = $this->sectionRepo->getAll();

        return Inertia::render('admin/sections/index', [
            'sections' => $sections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade_level' => 'required|string|max:50',
            'section_name' => 'required|string|max:50',
            'program' => 'nullable|string|max:50',
            'semester' => 'nullable|string|max:50',
            'school_year' => 'required|string|max:20',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $validated['program'] = $validated['program'] ?? 'BSAIT';
        $validated['semester'] = $validated['semester'] ?? '1st Semester';

        $this->sectionRepo->create($validated);

        return redirect()->back()->with('success', 'Section created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $section = $this->sectionRepo->findById($id);
        if (!$section) {
            return redirect()->back()->with('error', 'Section not found.');
        }

        $validated = $request->validate([
            'grade_level' => 'required|string|max:50',
            'section_name' => 'required|string|max:50',
            'program' => 'nullable|string|max:50',
            'semester' => 'nullable|string|max:50',
            'school_year' => 'required|string|max:20',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $validated['program'] = $validated['program'] ?? 'BSAIT';
        $validated['semester'] = $validated['semester'] ?? '1st Semester';

        $this->sectionRepo->update($section, $validated);

        return redirect()->back()->with('success', 'Section updated successfully.');
    }
}
