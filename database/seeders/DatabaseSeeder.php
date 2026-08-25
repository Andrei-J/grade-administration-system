<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database cleanly without mock data.
     */
    public function run(): void
    {
        try {
            app(\App\Services\SheetSyncService::class)->pushToGoogle();
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Seeder sheet sync notice: ' . $e->getMessage());
        }
    }
}
