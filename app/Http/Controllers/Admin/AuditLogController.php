<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\AuditLogRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function __construct(
        protected AuditLogRepository $auditRepo
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['user_id', 'student_id', 'action']);
        $logs = $this->auditRepo->getAll($filters);

        return Inertia::render('admin/audit-logs/index', [
            'logs' => $logs,
            'filters' => $filters,
        ]);
    }
}
