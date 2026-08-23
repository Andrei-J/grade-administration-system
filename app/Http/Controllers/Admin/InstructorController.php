<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\InstructorRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class InstructorController extends Controller
{
    public function __construct(
        protected InstructorRepository $instructorRepo,
        protected UserRepository $userRepo
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);
        $instructors = $this->instructorRepo->getAll($filters);

        return Inertia::render('admin/instructors/index', [
            'instructors' => $instructors,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'instructor_id' => 'required|string|unique:instructors,instructor_id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors,email|unique:users,email',
            'password' => 'required|string|min:8',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        // Create Instructor Profile
        $this->instructorRepo->create([
            'instructor_id' => $validated['instructor_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'],
        ]);

        // Create Authenticated User Account with Instructor Role
        $this->userRepo->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'instructor',
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Instructor account created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $instructor = $this->instructorRepo->getAll()->firstWhere('id', $id);
        if (!$instructor) {
            return redirect()->back()->with('error', 'Instructor not found.');
        }

        $validated = $request->validate([
            'instructor_id' => 'required|string|unique:instructors,instructor_id,' . $id,
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors,email,' . $id,
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $this->instructorRepo->update($instructor, $validated);

        // Also update matching User account if exists
        $user = $this->userRepo->findByEmail($instructor->email);
        if ($user) {
            $this->userRepo->update($user, [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'status' => $validated['status'],
            ]);
        }

        return redirect()->back()->with('success', 'Instructor account updated successfully.');
    }
}
