<?php

namespace App\Services;

use App\Repositories\GradeRepository;
use App\Repositories\StudentRepository;
use Illuminate\Support\Collection;

class RankingService
{
    public function __construct(
        protected GradeRepository $gradeRepo,
        protected StudentRepository $studentRepo
    ) {}

    /**
     * Compute section rankings for a given grade level, section, and school year.
     */
    public function calculateSectionRanking(?string $gradeLevel = null, ?string $section = null, ?string $schoolYear = null): array
    {
        $grades = $this->gradeRepo->getAll([
            'section_id' => $section,
            'school_year' => $schoolYear,
        ]);

        return $this->buildRankings($grades);
    }

    /**
     * Compute grade-level rankings.
     */
    public function calculateGradeLevelRanking(?string $gradeLevel = null, ?string $schoolYear = null): array
    {
        $grades = $this->gradeRepo->getAll([
            'school_year' => $schoolYear,
        ]);

        if ($gradeLevel) {
            $grades = $grades->filter(function ($g) use ($gradeLevel) {
                return $g->student && $g->student->grade_level === $gradeLevel;
            });
        }

        return $this->buildRankings($grades);
    }

    /**
     * Compute school-wide overall rankings across all year levels.
     */
    public function calculateOverallRanking(?string $schoolYear = null): array
    {
        $grades = $this->gradeRepo->getAll([
            'school_year' => $schoolYear,
        ]);

        return $this->buildRankings($grades);
    }

    /**
     * Helper to group grades by student, compute average, sort descending, and assign ranks with tie detection.
     */
    protected function buildRankings(Collection $grades): array
    {
        // Group by student_id
        $studentGrades = $grades->groupBy('student_id');
        $results = [];

        foreach ($studentGrades as $studentId => $items) {
            $student = $items->first()->student ?? $this->studentRepo->findByStudentId($studentId);
            $validGrades = $items->filter(fn($g) => $g->final_average !== null);

            if ($validGrades->isEmpty()) {
                continue;
            }

            $overallAvg = round($validGrades->avg('final_average'), 2);

            $results[] = [
                'student_id' => $studentId,
                'student_name' => $student?->name ?? 'Unknown Student',
                'grade_level' => $student?->grade_level ?? 'N/A',
                'section' => $student?->section ?? 'N/A',
                'school_year' => $student?->school_year ?? 'N/A',
                'subjects_count' => $items->count(),
                'average' => $overallAvg,
                'status' => $overallAvg >= 75.0 ? 'Passed' : 'Failed',
            ];
        }

        // Sort descending by average
        usort($results, fn($a, $b) => $b['average'] <=> $a['average']);

        // Assign dense ranks handling ties (1, 1, 3)
        $rankedResults = [];
        $currentRank = 1;

        foreach ($results as $index => $row) {
            if ($index > 0) {
                if ($row['average'] == $results[$index - 1]['average']) {
                    $row['rank'] = $results[$index - 1]['rank'];
                    $row['is_tie'] = true;
                    // Mark previous as tie too
                    if (isset($rankedResults[$index - 1])) {
                        $rankedResults[$index - 1]['is_tie'] = true;
                    }
                } else {
                    $row['rank'] = $index + 1;
                    $row['is_tie'] = false;
                }
            } else {
                $row['rank'] = 1;
                $row['is_tie'] = false;
            }

            $rankedResults[] = $row;
        }

        return $rankedResults;
    }
}
