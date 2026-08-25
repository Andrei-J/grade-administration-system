<?php

namespace App\Jobs;

use App\Services\GoogleSheetsService;
use App\Services\SheetSyncService;
use Exception;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SyncTableToSheetsJob implements ShouldQueue, ShouldBeUnique
{
    use Queueable;

    /**
     * Maximum number of attempts before giving up.
     */
    public int $tries = 3;

    /**
     * Time in seconds to wait between retries (exponential backoff).
     */
    public array $backoff = [30, 60, 120];

    /**
     * Job timeout in seconds.
     */
    public int $timeout = 90;

    public function __construct(
        public readonly string $table
    ) {
        // Execute immediately (0s delay) for instant real-time sync to Google Sheets
        $this->delay(now()->addSeconds(0));
    }

    /**
     * Unique key — one job per table name in the queue at a time.
     * This prevents the queue from flooding with dozens of identical jobs
     * when many records change at once (e.g. bulk import).
     */
    public function uniqueId(): string
    {
        return 'sheets_sync_' . $this->table;
    }

    /**
     * How long (seconds) the uniqueness lock is held.
     * After 15s the job runs; the lock releases so a new one can be queued.
     */
    public function uniqueFor(): int
    {
        return 15;
    }

    public function handle(SheetSyncService $syncService, GoogleSheetsService $sheets): void
    {
        // Silently skip in testing environment or if Google Sheets is not configured — no credentials yet.
        if (app()->environment('testing') || ! $sheets->isConfigured()) {
            Log::info("SyncTableToSheetsJob({$this->table}): Skipping in testing environment or when Google Sheets is not configured.");
            return;
        }

        Log::info("SyncTableToSheetsJob: pushing table '{$this->table}' to Google Sheets.");

        try {
            $summary = ['Uploaded' => 0, 'Updated' => 0, 'Failed' => 0];
            $syncService->pushTable($this->table, $summary);
            Log::info("SyncTableToSheetsJob({$this->table}): done.", $summary);
        } catch (Exception $e) {
            Log::error("SyncTableToSheetsJob({$this->table}) failed: " . $e->getMessage());
            // Re-throw so the queue runner retries with backoff.
            throw $e;
        }
    }

    /**
     * Handle a job failure after all retries are exhausted.
     */
    public function failed(Exception $e): void
    {
        Log::error("SyncTableToSheetsJob({$this->table}) permanently failed: " . $e->getMessage());
    }
}
