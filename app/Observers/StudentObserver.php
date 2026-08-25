<?php

namespace App\Observers;

use App\Jobs\SyncTableToSheetsJob;
use App\Models\Student;

class StudentObserver
{
    public function creating(Student $student): void
    {
        if (empty($student->sync_status) || $student->sync_status === 'synced') {
            $student->sync_status = 'pending';
        }
    }

    public function created(Student $student): void
    {
        SyncTableToSheetsJob::dispatchSync('students');
    }

    public function updating(Student $student): void
    {
        $dirtyKeys = array_keys($student->getDirty());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        if (count(array_diff($dirtyKeys, $syncFields)) > 0) {
            $student->sync_status = 'pending';
        }
    }

    public function updated(Student $student): void
    {
        if ($this->isSyncOnlyChange($student)) {
            return;
        }

        SyncTableToSheetsJob::dispatchSync('students');
    }

    public function deleted(Student $student): void
    {
        SyncTableToSheetsJob::dispatchSync('students');
    }

    private function isSyncOnlyChange(Student $student): bool
    {
        $changedKeys = array_keys($student->getChanges());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        return count(array_diff($changedKeys, $syncFields)) === 0;
    }
}
