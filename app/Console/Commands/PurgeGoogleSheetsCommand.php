<?php

namespace App\Console\Commands;

use App\Services\SheetSyncService;
use Illuminate\Console\Command;

class PurgeGoogleSheetsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:purge';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Purge all online Google Sheets tabs and push fresh local database state';

    /**
     * Execute the console command.
     */
    public function handle(SheetSyncService $syncService): int
    {
        $this->info('Purging online Google Sheets and pushing current database state...');

        $result = $syncService->pushToGoogle();

        if ($result['success']) {
            $this->info('Successfully purged and updated Google Sheets tabs!');
            return Command::SUCCESS;
        }

        $this->error('Failed to sync to Google Sheets: ' . ($result['message'] ?? 'Unknown error'));
        return Command::FAILURE;
    }
}
