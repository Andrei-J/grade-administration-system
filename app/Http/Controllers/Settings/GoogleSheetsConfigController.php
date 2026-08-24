<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Jobs\SyncTableToSheetsJob;
use App\Services\GoogleSheetsService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class GoogleSheetsConfigController extends Controller
{
    /**
     * Return current Google Sheets configuration state (used as JSON data for the profile page).
     */
    public function show(): JsonResponse
    {
        $credentialsPath = base_path(env('GOOGLE_SHEETS_CREDENTIALS', 'storage/app/google/service-account.json'));
        $credentialsExist = file_exists($credentialsPath);
        $credentialsJson = $credentialsExist ? file_get_contents($credentialsPath) : null;

        return response()->json([
            'spreadsheet_id'   => env('GOOGLE_SHEETS_ID', ''),
            'credentials_json' => $credentialsJson,
            'credentials_exist' => $credentialsExist,
            'is_connected'     => app(GoogleSheetsService::class)->isConfigured(),
        ]);
    }

    /**
     * Save Google Sheets credentials: write JSON to disk and update .env.
     */
    public function save(Request $request): JsonResponse
    {
        $request->validate([
            'spreadsheet_id'   => ['required', 'string', 'min:10'],
            'credentials_json' => ['required', 'string'],
        ]);

        // Validate JSON structure
        $json = $request->input('credentials_json');
        $decoded = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid JSON: ' . json_last_error_msg(),
            ], 422);
        }

        if (! isset($decoded['type']) || $decoded['type'] !== 'service_account') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid service account JSON. The "type" field must be "service_account".',
            ], 422);
        }

        try {
            // 1. Ensure the google directory exists in storage
            $googleDir = storage_path('app/google');
            if (! is_dir($googleDir)) {
                mkdir($googleDir, 0755, true);
            }

            // 2. Write the JSON credentials file
            $credentialsPath = $googleDir . '/service-account.json';
            file_put_contents($credentialsPath, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

            // 3. Update the .env file
            $this->updateEnvValue('GOOGLE_SHEETS_ID', $request->input('spreadsheet_id'));
            $this->updateEnvValue('GOOGLE_SHEETS_CREDENTIALS', 'storage/app/google/service-account.json');

            // 4. Clear config cache so new values are picked up immediately
            Artisan::call('config:clear');

            // 5. Dispatch initial sync for all tables with staggered delays.
            //    Staggering prevents all 8 tables from hitting the Google API simultaneously.
            $tables = ['users', 'students', 'instructors', 'subjects', 'sections', 'assignments', 'grades', 'audit_logs'];
            foreach ($tables as $index => $table) {
                SyncTableToSheetsJob::dispatch($table)
                    ->delay(now()->addSeconds(20 + ($index * 5)));
            }

            return response()->json([
                'success' => true,
                'message' => 'Google Sheets configuration saved. Initial sync scheduled — all data will appear in your spreadsheet within ~60 seconds.',
            ]);
        } catch (Exception $e) {
            Log::error('GoogleSheetsConfigController@save failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to save configuration: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Test the current Google Sheets connection using the spreadsheet metadata endpoint.
     * This does NOT require any specific sheet tab to exist — it simply verifies
     * that the credentials are valid and the spreadsheet ID is accessible.
     */
    public function testConnection(): JsonResponse
    {
        try {
            // Re-instantiate the service so changes saved in the same session are picked up
            $service = new GoogleSheetsService();

            if (! $service->isConfigured()) {
                return response()->json([
                    'connected' => false,
                    'message'   => 'Google Sheets is not configured. Please save your credentials first.',
                ]);
            }

            // Fetch spreadsheet metadata — no sheet tab name required
            $meta = $service->getSpreadsheetMetadata();
            $spreadsheetId = $service->getSpreadsheetId();
            $sheetNames = implode(', ', $meta['sheets'] ?? []);

            return response()->json([
                'connected'      => true,
                'spreadsheet_id' => $spreadsheetId,
                'title'          => $meta['title'],
                'sheets'         => $meta['sheets'],
                'message'        => "Connected! Spreadsheet: \"{$meta['title']}\" — Sheets: {$sheetNames}",
            ]);
        } catch (Exception $e) {
            return response()->json([
                'connected' => false,
                'message'   => 'Connection failed: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Update a single key-value pair in the .env file.
     */
    private function updateEnvValue(string $key, string $value): void
    {
        $envPath = base_path('.env');
        $envContent = file_get_contents($envPath);

        // Escape special characters in value if needed
        $escapedValue = str_contains($value, ' ') ? '"' . $value . '"' : $value;

        // Replace existing key or append
        if (preg_match('/^' . preg_quote($key, '/') . '=.*/m', $envContent)) {
            $envContent = preg_replace(
                '/^' . preg_quote($key, '/') . '=.*/m',
                $key . '=' . $escapedValue,
                $envContent
            );
        } else {
            $envContent .= PHP_EOL . $key . '=' . $escapedValue;
        }

        file_put_contents($envPath, $envContent);
    }
}
