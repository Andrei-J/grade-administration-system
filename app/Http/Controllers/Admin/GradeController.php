<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\GradeRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\SectionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GradeController extends Controller
{
    public function __construct(
        protected GradeRepository $gradeRepo,
        protected SubjectRepository $subjectRepo,
        protected SectionRepository $sectionRepo
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['student_id', 'subject_id', 'section_id', 'school_year']);
        $grades = $this->gradeRepo->getAll($filters);
        $subjects = $this->subjectRepo->getAll();
        $sections = $this->sectionRepo->getAll();

        return Inertia::render('admin/grades/index', [
            'grades' => $grades,
            'subjects' => $subjects,
            'sections' => $sections,
            'filters' => $filters,
        ]);
    }
}
