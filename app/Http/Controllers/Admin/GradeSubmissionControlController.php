<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GradeSubmissionControlController extends Controller
{
    public function index(): Response
    {
        $gradeSubmissionSettings = SystemSetting::getSetting('grade_submission', [
            'is_disabled' => false,
            'disable_at' => null,
            'enable_at' => null,
            'message' => 'Grade submission is currently disabled by the administration.',
        ]);

        $isSubmissionDisabled = SystemSetting::isGradeSubmissionDisabled();

        return Inertia::render('admin/submission-control/index', [
            'gradeSubmissionSettings' => $gradeSubmissionSettings,
            'isSubmissionDisabled' => $isSubmissionDisabled,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'is_disabled' => 'required|boolean',
            'disable_at' => 'nullable|string',
            'enable_at' => 'nullable|string',
            'message' => 'nullable|string|max:500',
        ]);

        SystemSetting::setSetting('grade_submission', $validated);

        AdminAuditLog::create([
            'email' => $request->user()?->email,
            'user_name' => $request->user()?->name,
            'role' => 'admin',
            'action' => 'UPDATE_GRADE_SUBMISSION_SETTINGS',
            'status' => 'SUCCESS',
            'details' => "Updated grade submission control settings. Disabled: " . ($validated['is_disabled'] ? 'YES' : 'NO') . ", Scheduled Disable: " . ($validated['disable_at'] ?? 'None') . ", Scheduled Re-enable: " . ($validated['enable_at'] ?? 'None'),
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Grade submission control settings updated successfully.');
    }
}
