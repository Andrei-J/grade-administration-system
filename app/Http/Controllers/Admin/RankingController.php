<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\RankingService;
use App\Repositories\SectionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RankingController extends Controller
{
    public function __construct(
        protected RankingService $rankingService,
        protected SectionRepository $sectionRepo
    ) {}

    public function index(Request $request): Response
    {
        $schoolYear = $request->get('school_year', '2026-2027');
        $section = $request->get('section');
        $gradeLevel = $request->get('grade_level');

        $sections = $this->sectionRepo->getAll();

        $sectionRankings = $this->rankingService->calculateSectionRanking($gradeLevel, $section, $schoolYear);
        $gradeLevelRankings = $this->rankingService->calculateGradeLevelRanking($gradeLevel, $schoolYear);
        $overallRankings = $this->rankingService->calculateOverallRanking($schoolYear);

        return Inertia::render('admin/rankings/index', [
            'sectionRankings' => $sectionRankings,
            'gradeLevelRankings' => $gradeLevelRankings,
            'overallRankings' => $overallRankings,
            'sections' => $sections,
            'filters' => [
                'school_year' => $schoolYear,
                'section' => $section,
                'grade_level' => $gradeLevel,
            ],
        ]);
    }
}
