<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GradeController extends Controller
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

        // Fetch grades strictly for authenticated student
        $grades = Grade::with(['subject', 'instructor'])
            ->where('student_id', $student->student_id)
            ->get()
            ->map(function ($g) {
                $avg = $g->final_average;
                $status = is_null($avg) ? 'Pending' : ($avg >= 75 ? 'Passed' : 'Failed');
                return [
                    'id' => $g->id,
                    'subject_code' => $g->subject?->subject_code ?? 'N/A',
                    'subject_name' => $g->subject?->subject_name ?? 'N/A',
                    'instructor_name' => $g->instructor?->name ?? 'Unassigned',
                    'prelim' => $g->prelim ? number_format((float)$g->prelim, 2) : '-',
                    'midterm' => $g->midterm ? number_format((float)$g->midterm, 2) : '-',
                    'final' => $g->final ? number_format((float)$g->final, 2) : '-',
                    'average' => $avg ? number_format((float)$avg, 2) : '-',
                    'status' => $status,
                ];
            });

        return Inertia::render('student/grades/index', [
            'studentInfo' => [
                'name' => $student->name,
                'student_id' => $student->student_id,
                'grade_level' => $student->grade_level,
                'section' => $student->section,
                'program' => $student->program ?? 'BSAIT',
                'semester' => $student->semester ?? '1st Semester',
                'school_year' => $student->school_year,
            ],
            'grades' => $grades,
        ]);
    }
}
