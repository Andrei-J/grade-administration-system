<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\StudentRepository;
use App\Repositories\SectionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function __construct(
        protected StudentRepository $studentRepo,
        protected SectionRepository $sectionRepo
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'grade_level', 'section', 'school_year']);
        $students = $this->studentRepo->getAll($filters);
        $sections = $this->sectionRepo->getAll();
        $programs = \App\Models\Program::orderBy('code', 'asc')->get();

        $students->transform(function ($student) {
            $user = \App\Models\User::where('profile_id', $student->student_id)->first();
            $student->email = $user ? $user->email : null;
            return $student;
        });

        return Inertia::render('admin/students/index', [
            'students' => $students,
            'sections' => $sections,
            'programs' => $programs,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string|unique:students,student_id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:8',
            'grade_level' => 'required|string|max:50',
            'section' => 'required|string|max:50',
            'program' => 'nullable|string|max:50',
            'semester' => 'nullable|string|max:50',
            'school_year' => 'required|string|max:20',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $student = $this->studentRepo->create([
            'student_id' => $validated['student_id'],
            'name' => $validated['name'],
            'grade_level' => $validated['grade_level'],
            'section' => $validated['section'],
            'program' => $validated['program'] ?? 'BSAIT',
            'semester' => $validated['semester'] ?? '1st Semester',
            'school_year' => $validated['school_year'],
            'status' => $validated['status'],
        ]);

        $email = !empty($validated['email']) ? $validated['email'] : strtolower(str_replace(' ', '.', $validated['name'])) . '.' . rand(100, 999) . '@student.edu';
        $password = !empty($validated['password']) ? $validated['password'] : 'password123';

        \App\Models\User::updateOrCreate(
            ['profile_id' => $student->student_id],
            [
                'name' => $validated['name'],
                'email' => $email,
                'password' => \Illuminate\Support\Facades\Hash::make($password),
                'role' => 'student',
                'status' => $validated['status'],
            ]
        );

        \App\Models\AdminAuditLog::create([
            'email' => $request->user()?->email,
            'user_name' => $request->user()?->name,
            'role' => 'admin',
            'action' => 'CREATE_STUDENT',
            'status' => 'SUCCESS',
            'details' => "Created student record {$student->name} ({$student->student_id}) in section {$student->section}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', "Student record for {$student->name} ({$student->student_id}) created successfully.");
    }

    public function update(Request $request, int $id)
    {
        $student = $this->studentRepo->findById($id);
        if (!$student) {
            return redirect()->back()->with('error', 'Student not found.');
        }

        $user = \App\Models\User::where('profile_id', $student->student_id)->first();
        $userId = $user ? $user->id : null;

        $validated = $request->validate([
            'student_id' => 'required|string|unique:students,student_id,' . $id,
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:8',
            'grade_level' => 'required|string|max:50',
            'section' => 'required|string|max:50',
            'program' => 'nullable|string|max:50',
            'semester' => 'nullable|string|max:50',
            'school_year' => 'required|string|max:20',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $oldStudentId = $student->student_id;

        $this->studentRepo->update($student, [
            'student_id' => $validated['student_id'],
            'name' => $validated['name'],
            'grade_level' => $validated['grade_level'],
            'section' => $validated['section'],
            'program' => $validated['program'] ?? 'BSAIT',
            'semester' => $validated['semester'] ?? '1st Semester',
            'school_year' => $validated['school_year'],
            'status' => $validated['status'],
        ]);

        $email = !empty($validated['email']) ? $validated['email'] : ($user ? $user->email : strtolower(str_replace(' ', '.', $validated['name'])) . '.' . rand(100, 999) . '@student.edu');

        if ($user) {
            $userData = [
                'name' => $validated['name'],
                'email' => $email,
                'status' => $validated['status'],
                'profile_id' => $validated['student_id'],
            ];
            if (!empty($validated['password'])) {
                $userData['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
            }
            $user->update($userData);
        } else {
            \App\Models\User::create([
                'name' => $validated['name'],
                'email' => $email,
                'password' => \Illuminate\Support\Facades\Hash::make($validated['password'] ?? 'password123'),
                'role' => 'student',
                'status' => $validated['status'],
                'profile_id' => $validated['student_id'],
            ]);
        }

        \App\Models\AdminAuditLog::create([
            'email' => $request->user()?->email,
            'user_name' => $request->user()?->name,
            'role' => 'admin',
            'action' => 'UPDATE_STUDENT',
            'status' => 'SUCCESS',
            'details' => "Updated student {$validated['name']} ({$validated['student_id']})",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', "Student record for {$validated['name']} updated successfully.");
    }

    public function destroy(Request $request, int $id)
    {
        $student = $this->studentRepo->findById($id);
        if ($student) {
            \App\Models\User::where('profile_id', $student->student_id)->delete();
            $this->studentRepo->delete($student);

            \App\Models\AdminAuditLog::create([
                'email' => $request->user()?->email,
                'user_name' => $request->user()?->name,
                'role' => 'admin',
                'action' => 'DELETE_STUDENT',
                'status' => 'SUCCESS',
                'details' => "Deleted student record {$student->name} ({$student->student_id})",
                'ip_address' => $request->ip(),
            ]);
        }

        return redirect()->back()->with('success', 'Student record deleted successfully.');
    }
}
