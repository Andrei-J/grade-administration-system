<?php

namespace App\Observers;

use App\Jobs\SyncTableToSheetsJob;
use App\Models\Assignment;

class AssignmentObserver
{
    public function creating(Assignment $assignment): void
    {
        if (empty($assignment->sync_status) || $assignment->sync_status === 'synced') {
            $assignment->sync_status = 'pending';
        }
    }

    public function created(Assignment $assignment): void
    {
        SyncTableToSheetsJob::dispatch('assignments');
    }

    public function updating(Assignment $assignment): void
    {
        $dirtyKeys = array_keys($assignment->getDirty());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        if (count(array_diff($dirtyKeys, $syncFields)) > 0) {
            $assignment->sync_status = 'pending';
        }
    }

    public function updated(Assignment $assignment): void
    {
        if ($this->isSyncOnlyChange($assignment)) {
            return;
        }

        SyncTableToSheetsJob::dispatch('assignments');
    }

    public function deleted(Assignment $assignment): void
    {
        SyncTableToSheetsJob::dispatch('assignments');
    }

    private function isSyncOnlyChange(Assignment $assignment): bool
    {
        $changedKeys = array_keys($assignment->getChanges());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        return count(array_diff($changedKeys, $syncFields)) === 0;
    }
}
