<?php

namespace App\Observers;

use App\Jobs\SyncTableToSheetsJob;
use App\Models\User;

class UserObserver
{
    public function creating(User $user): void
    {
        if (empty($user->sync_status) || $user->sync_status === 'synced') {
            $user->sync_status = 'pending';
        }
    }

    public function created(User $user): void
    {
        SyncTableToSheetsJob::dispatchSync('users');
    }

    public function updating(User $user): void
    {
        $dirtyKeys = array_keys($user->getDirty());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        if (count(array_diff($dirtyKeys, $syncFields)) > 0) {
            $user->sync_status = 'pending';
        }
    }

    public function updated(User $user): void
    {
        if ($this->isSyncOnlyChange($user)) {
            return;
        }

        SyncTableToSheetsJob::dispatchSync('users');
    }

    public function deleted(User $user): void
    {
        SyncTableToSheetsJob::dispatchSync('users');
    }

    private function isSyncOnlyChange(User $user): bool
    {
        $changedKeys = array_keys($user->getChanges());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        return count(array_diff($changedKeys, $syncFields)) === 0;
    }
}
