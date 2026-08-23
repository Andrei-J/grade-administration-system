<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Repositories\AuditLogRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditActivityController extends Controller
{
    public function __construct(
        protected AuditLogRepository $auditRepo
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $logs = $this->auditRepo->getAll(['user_id' => (string)$user->id]);

        return Inertia::render('instructor/audit-activity/index', [
            'logs' => $logs,
        ]);
    }
}
