<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Repositories\AssignmentRepository;
use App\Repositories\StudentRepository;
use App\Repositories\GradeRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected AssignmentRepository $assignmentRepo,
        protected StudentRepository $studentRepo,
        protected GradeRepository $gradeRepo
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get instructor assignments matching user email/name
        $assignments = $this->assignmentRepo->getForInstructor($user->email);
        if ($assignments->isEmpty()) {
            $assignments = $this->assignmentRepo->getAll()->filter(function ($a) use ($user) {
                return $a->instructor_id === $user->email || $a->instructor_id === (string)$user->id || ($a->instructor && $a->instructor->email === $user->email);
            });
        }

        $grades = $this->gradeRepo->getAll(['instructor_id' => $user->email]);
        $pendingEntriesCount = $grades->whereNull('final_average')->count();
        $recentUpdates = $grades->sortByDesc('updated_at')->take(5)->values();

        return Inertia::render('instructor/dashboard', [
            'instructorName' => $user->name,
            'assignedClasses' => $assignments->values(),
            'stats' => [
                'assigned_classes_count' => $assignments->count(),
                'pending_entries' => $pendingEntriesCount,
                'total_graded' => $grades->count(),
            ],
            'recentUpdates' => $recentUpdates,
        ]);
    }
}
