<?php

namespace App\Observers;

use App\Jobs\SyncTableToSheetsJob;
use App\Models\Section;

class SectionObserver
{
    public function creating(Section $section): void
    {
        if (empty($section->sync_status) || $section->sync_status === 'synced') {
            $section->sync_status = 'pending';
        }
    }

    public function created(Section $section): void
    {
        SyncTableToSheetsJob::dispatch('sections');
    }

    public function updating(Section $section): void
    {
        $dirtyKeys = array_keys($section->getDirty());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        if (count(array_diff($dirtyKeys, $syncFields)) > 0) {
            $section->sync_status = 'pending';
        }
    }

    public function updated(Section $section): void
    {
        if ($this->isSyncOnlyChange($section)) {
            return;
        }

        SyncTableToSheetsJob::dispatch('sections');
    }

    public function deleted(Section $section): void
    {
        SyncTableToSheetsJob::dispatch('sections');
    }

    private function isSyncOnlyChange(Section $section): bool
    {
        $changedKeys = array_keys($section->getChanges());
        $syncFields = ['sync_status', 'synced_at', 'google_sheet_id', 'updated_at'];
        return count(array_diff($changedKeys, $syncFields)) === 0;
    }
}
