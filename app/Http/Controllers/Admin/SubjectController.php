<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\SubjectRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function __construct(
        protected SubjectRepository $subjectRepo
    ) {}

    public function index(): Response
    {
        $subjects = $this->subjectRepo->getAll();

        return Inertia::render('admin/subjects/index', [
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_code' => 'required|string|unique:subjects,subject_code',
            'subject_name' => 'required|string|max:255',
            'password' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $this->subjectRepo->create($validated);

        \App\Models\AdminAuditLog::create([
            'email' => $request->user()?->email,
            'user_name' => $request->user()?->name,
            'role' => 'admin',
            'action' => 'CREATE_SUBJECT',
            'status' => 'SUCCESS',
            'details' => "Created subject {$validated['subject_code']} ({$validated['subject_name']})",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Subject created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $subject = $this->subjectRepo->getAll()->firstWhere('id', $id);
        if (!$subject) {
            return redirect()->back()->with('error', 'Subject not found.');
        }

        $validated = $request->validate([
            'subject_code' => 'required|string|unique:subjects,subject_code,' . $id,
            'subject_name' => 'required|string|max:255',
            'password' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $this->subjectRepo->update($subject, $validated);

        \App\Models\AdminAuditLog::create([
            'email' => $request->user()?->email,
            'user_name' => $request->user()?->name,
            'role' => 'admin',
            'action' => 'UPDATE_SUBJECT',
            'status' => 'SUCCESS',
            'details' => "Updated subject {$validated['subject_code']} ({$validated['subject_name']})",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Subject updated successfully.');
    }
}
