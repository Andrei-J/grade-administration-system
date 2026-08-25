<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class StudentRegistrationController extends Controller
{
    public function create(): Response
    {
        $sections = \App\Models\Section::where('status', 'Active')->get();
        $dbPrograms = \App\Models\Program::where('status', 'Active')->orderBy('code')->pluck('code')->toArray();
        $programs = !empty($dbPrograms) ? $dbPrograms : ['BSIT', 'BSAIT', 'BSCS', 'BSIS'];
        $semesters = ['1st Semester', '2nd Semester', 'Summer'];

        return Inertia::render('auth/student-register', [
            'sections' => $sections,
            'programs' => $programs,
            'semesters' => $semesters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'student_id' => 'nullable|string|max:50|unique:students,student_id',
            'grade_level' => 'required|string|max:50',
            'section' => 'required|string|max:50',
            'program' => 'nullable|string|max:50',
            'semester' => 'nullable|string|max:50',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $studentId = !empty($validated['student_id']) 
            ? $validated['student_id'] 
            : 'STU-' . rand(100000, 999999);

        // Create student profile
        $student = Student::create([
            'student_id' => $studentId,
            'name' => $validated['name'],
            'grade_level' => $validated['grade_level'],
            'section' => $validated['section'],
            'program' => $validated['program'] ?? 'BSAIT',
            'semester' => $validated['semester'] ?? '1st Semester',
            'school_year' => '2026-2027',
            'status' => 'Active',
        ]);

        // Create user account
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'student',
            'status' => 'Active',
            'profile_id' => $studentId,
        ]);

        Auth::login($user);

        return redirect('/student/dashboard');
    }
}
