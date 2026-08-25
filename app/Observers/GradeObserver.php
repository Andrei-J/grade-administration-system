<?php

namespace App\Observers;

use App\Jobs\SyncTableToSheetsJob;
use App\Models\Grade;

class GradeObserver
{
    public function creating(Grade $grade): void
    {
        if (empty($grade->sync_status) || $grade->sync_status === 'synced') {
            $grade->sync_status = 'pending';
        }
    }

    public function created(Grade $grade): void
    {
        SyncTableToSheetsJob::dispatchSync('grades');
    }

    public function updating(Grade $grade): void
    {
        $dirtyKeys = array_keys($grade->getDirty());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        if (count(array_diff($dirtyKeys, $syncFields)) > 0) {
            $grade->sync_status = 'pending';
        }
    }

    public function updated(Grade $grade): void
    {
        if ($this->isSyncOnlyChange($grade)) {
            return;
        }

        SyncTableToSheetsJob::dispatchSync('grades');
    }

    public function deleted(Grade $grade): void
    {
        SyncTableToSheetsJob::dispatchSync('grades');
    }

    private function isSyncOnlyChange(Grade $grade): bool
    {
        $changedKeys = array_keys($grade->getChanges());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        return count(array_diff($changedKeys, $syncFields)) === 0;
    }
}
