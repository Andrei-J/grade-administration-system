<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Services\GradeService;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function __construct(
        protected GradeService $gradeService
    ) {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string',
            'subject_id' => 'required|string',
            'section_id' => 'required|string',
            'school_year' => 'required|string',
            'prelim' => 'nullable|numeric|min:0|max:100',
            'midterm' => 'nullable|numeric|min:0|max:100',
            'final' => 'nullable|numeric|min:0|max:100',
            'submit' => 'nullable|boolean',
        ]);

        $user = $request->user();
        $validated['instructor_id'] = $user->email;

        try {
            $this->gradeService->encodeGrade($user, $validated, $request->ip());
            return redirect()->back()->with('success', 'Grade record saved successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
