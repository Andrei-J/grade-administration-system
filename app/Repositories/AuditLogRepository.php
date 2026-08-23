<?php

namespace App\Repositories;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Collection;

class AuditLogRepository
{
    public function getAll(array $filters = []): Collection
    {
        $query = AuditLog::query();

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }
        if (!empty($filters['student_id'])) {
            $query->where('student_id', $filters['student_id']);
        }
        if (!empty($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function create(array $data): AuditLog
    {
        $data['sync_status'] = 'pending';
        return AuditLog::create($data);
    }

    public function getPendingSync(): Collection
    {
        return AuditLog::where('sync_status', 'pending')->get();
    }

    public function markSynced(AuditLog $log, ?string $googleSheetId = null): void
    {
        $log->update([
            'sync_status' => 'synced',
            'synced_at' => now(),
            'google_sheet_id' => $googleSheetId ?? $log->google_sheet_id,
        ]);
    }
}
