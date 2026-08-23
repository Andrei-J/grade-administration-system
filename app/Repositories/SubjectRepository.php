<?php

namespace App\Repositories;

use App\Models\Subject;
use Illuminate\Database\Eloquent\Collection;

class SubjectRepository
{
    public function getAll(): Collection
    {
        return Subject::orderBy('subject_code')->get();
    }

    public function findByCode(string $code): ?Subject
    {
        return Subject::where('subject_code', $code)->first();
    }

    public function create(array $data): Subject
    {
        $data['sync_status'] = 'pending';
        return Subject::create($data);
    }

    public function update(Subject $subject, array $data): bool
    {
        $data['sync_status'] = 'pending';
        return $subject->update($data);
    }

    public function getPendingSync(): Collection
    {
        return Subject::where('sync_status', 'pending')->get();
    }

    public function markSynced(Subject $subject, ?string $googleSheetId = null): void
    {
        $subject->update([
            'sync_status' => 'synced',
            'synced_at' => now(),
            'google_sheet_id' => $googleSheetId ?? $subject->google_sheet_id,
        ]);
    }
}
