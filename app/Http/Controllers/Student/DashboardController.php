<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\Student;
use App\Models\Section;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
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
                'program' => 'BSAIT',
                'semester' => '1st Semester',
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

        // Retrieve grades strictly for this student identity
        $grades = Grade::with(['subject', 'instructor'])
            ->where('student_id', $studentId)
            ->get();

        // Calculate enrolled subjects from grades or assigned section subjects
        $enrolledSubjectsCount = $grades->count();
        if ($enrolledSubjectsCount === 0) {
            $section = Section::where('section_name', $student->section)->first();
            if ($section) {
                $enrolledSubjectsCount = Assignment::where('section_id', (string)$section->id)->count();
            }
        }

        // Calculate Average, Passed, and Failed counts dynamically
        $validAverages = $grades->pluck('final_average')->filter(fn($val) => !is_null($val));
        $currentAverage = $validAverages->count() > 0 ? round($validAverages->avg(), 2) : 0.00;

        $passedCount = $grades->filter(fn($g) => !is_null($g->final_average) && $g->final_average >= 75)->count();
        $failedCount = $grades->filter(fn($g) => !is_null($g->final_average) && $g->final_average < 75)->count();

        // Recent Grades summary
        $recentGrades = $grades->map(function ($g) {
            $avg = $g->final_average;
            $status = is_null($avg) ? 'Pending' : ($avg >= 75 ? 'Passed' : 'Failed');
            return [
                'id' => $g->id,
                'subject_code' => $g->subject?->subject_code ?? 'N/A',
                'subject_name' => $g->subject?->subject_name ?? 'N/A',
                'instructor_name' => $g->instructor?->name ?? 'Unassigned',
                'prelim' => $g->prelim,
                'midterm' => $g->midterm,
                'final' => $g->final,
                'final_average' => $avg,
                'status' => $status,
            ];
        });

        return Inertia::render('student/dashboard', [
            'studentInfo' => [
                'name' => $student->name,
                'student_id' => $student->student_id,
                'grade_level' => $student->grade_level,
                'section' => $student->section,
                'program' => $student->program ?? 'BSAIT',
                'semester' => $student->semester ?? '1st Semester',
                'school_year' => $student->school_year,
                'email' => $user->email,
            ],
            'summary' => [
                'subjects_count' => $enrolledSubjectsCount,
                'current_average' => $currentAverage,
                'passed_count' => $passedCount,
                'failed_count' => $failedCount,
            ],
            'recentGrades' => $recentGrades,
        ]);
    }
}
