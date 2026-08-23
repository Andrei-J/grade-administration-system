<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\StudentRepository;
use App\Repositories\InstructorRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\SectionRepository;
use App\Repositories\GradeRepository;
use App\Repositories\AuditLogRepository;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected StudentRepository $studentRepo,
        protected InstructorRepository $instructorRepo,
        protected SubjectRepository $subjectRepo,
        protected SectionRepository $sectionRepo,
        protected GradeRepository $gradeRepo,
        protected AuditLogRepository $auditRepo
    ) {}

    public function index(): Response
    {
        $allStudents = $this->studentRepo->getAll();
        $allInstructors = $this->instructorRepo->getAll();
        $allSubjects = $this->subjectRepo->getAll();
        $allSections = $this->sectionRepo->getAll();
        $allGrades = $this->gradeRepo->getAll();
        $recentAudits = $this->auditRepo->getAll()->take(10);

        $passedCount = $allGrades->where('status', 'Passed')->count();
        $failedCount = $allGrades->where('status', 'Failed')->count();
        $pendingCount = $allGrades->where('status', 'Pending')->count();

        // Grade Distribution
        $gradeDistribution = [
            'Excellent' => $allGrades->where('final_average', '>=', 90)->count(),
            'Passed' => $allGrades->where('final_average', '>=', 75)->where('final_average', '<', 90)->count(),
            'Failed' => $failedCount,
            'Pending' => $pendingCount,
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_students' => $allStudents->count(),
                'total_instructors' => $allInstructors->count(),
                'total_subjects' => $allSubjects->count(),
                'total_sections' => $allSections->count(),
                'total_grades' => $allGrades->count(),
                'passed_students' => $passedCount,
                'failed_students' => $failedCount,
            ],
            'gradeDistribution' => $gradeDistribution,
            'recentAudits' => $recentAudits,
        ]);
    }
}
