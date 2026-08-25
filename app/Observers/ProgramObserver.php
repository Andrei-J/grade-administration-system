<?php

namespace App\Observers;

use App\Jobs\SyncTableToSheetsJob;
use App\Models\Program;

class ProgramObserver
{
    public function created(Program $program): void
    {
        SyncTableToSheetsJob::dispatchSync('programs');
    }

    public function updated(Program $program): void
    {
        SyncTableToSheetsJob::dispatchSync('programs');
    }

    public function deleted(Program $program): void
    {
        SyncTableToSheetsJob::dispatchSync('programs');
    }
}
