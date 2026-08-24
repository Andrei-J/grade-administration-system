<?php

namespace App\Observers;

use App\Jobs\SyncTableToSheetsJob;
use App\Models\Instructor;

class InstructorObserver
{
    public function creating(Instructor $instructor): void
    {
        if (empty($instructor->sync_status) || $instructor->sync_status === 'synced') {
            $instructor->sync_status = 'pending';
        }
    }

    public function created(Instructor $instructor): void
    {
        SyncTableToSheetsJob::dispatch('instructors');
    }

    public function updating(Instructor $instructor): void
    {
        $dirtyKeys = array_keys($instructor->getDirty());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        if (count(array_diff($dirtyKeys, $syncFields)) > 0) {
            $instructor->sync_status = 'pending';
        }
    }

    public function updated(Instructor $instructor): void
    {
        if ($this->isSyncOnlyChange($instructor)) {
            return;
        }

        SyncTableToSheetsJob::dispatch('instructors');
    }

    public function deleted(Instructor $instructor): void
    {
        SyncTableToSheetsJob::dispatch('instructors');
    }

    private function isSyncOnlyChange(Instructor $instructor): bool
    {
        $changedKeys = array_keys($instructor->getChanges());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        return count(array_diff($changedKeys, $syncFields)) === 0;
    }
}
