<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\ProgramRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramController extends Controller
{
    public function __construct(
        protected ProgramRepository $programRepo
    ) {}

    public function index(): Response
    {
        $programs = $this->programRepo->getAll();

        return Inertia::render('admin/programs/index', [
            'programs' => $programs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:programs,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $this->programRepo->create($validated);

        return redirect()->back()->with('success', 'Program created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $program = $this->programRepo->findById($id);
        if (!$program) {
            return redirect()->back()->with('error', 'Program not found.');
        }

        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:programs,code,' . $id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $this->programRepo->update($program, $validated);

        return redirect()->back()->with('success', 'Program updated successfully.');
    }

    public function destroy(int $id)
    {
        $program = $this->programRepo->findById($id);
        if (!$program) {
            return redirect()->back()->with('error', 'Program not found.');
        }

        $this->programRepo->delete($program);

        return redirect()->back()->with('success', 'Program deleted successfully.');
    }
}
