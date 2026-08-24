<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class RankingController extends Controller
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
                'school_year' => '2026-2027',
                'status' => 'Active',
            ]);
            $user->profile_id = $studentId;
            $user->save();
        }

        return $student;
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $student = $this->resolveStudent($user);

        $studentId = $student->student_id;
        $sectionName = $student->section;
        $gradeLevel = $student->grade_level;

        // Calculate student averages across all students with encoded grades
        $studentAverages = Grade::select('student_id', DB::raw('AVG(final_average) as overall_avg'))
            ->whereNotNull('final_average')
            ->groupBy('student_id')
            ->orderByDesc('overall_avg')
            ->get();

        $totalStudents = Student::count();
        $totalSectionStudents = Student::where('section', $sectionName)->count();
        $totalGradeLevelStudents = Student::where('grade_level', $gradeLevel)->count();

        // Compute overall rank index
        $overallRankIndex = $studentAverages->search(fn($item) => $item->student_id === $studentId);
        $overallRank = $overallRankIndex !== false ? $overallRankIndex + 1 : 'N/A';

        // Compute section rank
        $sectionStudentIds = Student::where('section', $sectionName)->pluck('student_id')->toArray();
        $sectionAverages = $studentAverages->filter(fn($item) => in_array($item->student_id, $sectionStudentIds))->values();
        $sectionRankIndex = $sectionAverages->search(fn($item) => $item->student_id === $studentId);
        $sectionRank = $sectionRankIndex !== false ? $sectionRankIndex + 1 : 'N/A';

        // Compute grade level rank
        $gradeLevelStudentIds = Student::where('grade_level', $gradeLevel)->pluck('student_id')->toArray();
        $gradeLevelAverages = $studentAverages->filter(fn($item) => in_array($item->student_id, $gradeLevelStudentIds))->values();
        $gradeLevelRankIndex = $gradeLevelAverages->search(fn($item) => $item->student_id === $studentId);
        $gradeLevelRank = $gradeLevelRankIndex !== false ? $gradeLevelRankIndex + 1 : 'N/A';

        // Overall GPA of the logged-in student
        $myAvgObj = $studentAverages->firstWhere('student_id', $studentId);
        $gpa = $myAvgObj ? round($myAvgObj->overall_avg, 2) : 0.00;

        return Inertia::render('student/ranking/index', [
            'studentInfo' => [
                'name' => $student->name,
                'student_id' => $studentId,
                'grade_level' => $gradeLevel,
                'section' => $sectionName,
                'school_year' => $student->school_year,
                'gpa' => $gpa,
            ],
            'ranking' => [
                'section_rank' => $sectionRank,
                'section_total' => $totalSectionStudents,
                'grade_level_rank' => $gradeLevelRank,
                'grade_level_total' => $totalGradeLevelStudents,
                'overall_rank' => $overallRank,
                'overall_total' => $totalStudents,
            ],
        ]);
    }
}
