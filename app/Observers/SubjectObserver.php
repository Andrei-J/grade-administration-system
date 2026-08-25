<?php

namespace App\Observers;

use App\Jobs\SyncTableToSheetsJob;
use App\Models\Subject;

class SubjectObserver
{
    public function creating(Subject $subject): void
    {
        if (empty($subject->sync_status) || $subject->sync_status === 'synced') {
            $subject->sync_status = 'pending';
        }
    }

    public function created(Subject $subject): void
    {
        SyncTableToSheetsJob::dispatchSync('subjects');
    }

    public function updating(Subject $subject): void
    {
        $dirtyKeys = array_keys($subject->getDirty());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        if (count(array_diff($dirtyKeys, $syncFields)) > 0) {
            $subject->sync_status = 'pending';
        }
    }

    public function updated(Subject $subject): void
    {
        if ($this->isSyncOnlyChange($subject)) {
            return;
        }

        SyncTableToSheetsJob::dispatchSync('subjects');
    }

    public function deleted(Subject $subject): void
    {
        SyncTableToSheetsJob::dispatchSync('subjects');
    }

    private function isSyncOnlyChange(Subject $subject): bool
    {
        $changedKeys = array_keys($subject->getChanges());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        return count(array_diff($changedKeys, $syncFields)) === 0;
    }
}
