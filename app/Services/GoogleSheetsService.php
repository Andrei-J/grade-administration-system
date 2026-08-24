<?php

namespace App\Services;

use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\ValueRange;
use Exception;
use Illuminate\Support\Facades\Log;

class GoogleSheetsService
{
    protected ?Sheets $service = null;
    protected ?string $spreadsheetId = null;
    protected bool $isConfigured = false;

    public function __construct()
    {
        $this->spreadsheetId = env('GOOGLE_SHEETS_ID', '1i-y0UrR_4UnsxtpyLyY1InjTjUTTLmhW8OdUdTjFqfA');
        $credentialsPath = base_path(env('GOOGLE_SHEETS_CREDENTIALS', 'storage/app/google/service-account.json'));

        if (file_exists($credentialsPath) && !empty($this->spreadsheetId)) {
            try {
                $client = new Client();
                $client->setApplicationName('Secure Grade Administration System');
                $client->setScopes([Sheets::SPREADSHEETS]);
                $client->setAuthConfig($credentialsPath);
                $this->service = new Sheets($client);
                $this->isConfigured = true;
            } catch (Exception $e) {
                Log::error('Google Sheets Client Initialization Failed: ' . $e->getMessage());
                $this->isConfigured = false;
            }
        }
    }

    public function isConfigured(): bool
    {
        return $this->isConfigured && $this->service !== null;
    }

    public function getSpreadsheetId(): ?string
    {
        return $this->spreadsheetId;
    }

    /**
     * Fetch spreadsheet metadata (title, sheet names) without needing a specific tab.
     * Safe to use as a connection test.
     */
    public function getSpreadsheetMetadata(): array
    {
        if (!$this->isConfigured()) {
            throw new Exception('Google Sheets API is not configured or service account credentials are missing.');
        }

        try {
            $spreadsheet = $this->service->spreadsheets->get($this->spreadsheetId);
            $sheets = array_map(
                fn($sheet) => $sheet->getProperties()->getTitle(),
                $spreadsheet->getSheets()
            );

            return [
                'title'  => $spreadsheet->getProperties()->getTitle(),
                'sheets' => $sheets,
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch spreadsheet metadata: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Fetch all values from a given sheet tab.
     */
    public function getTabValues(string $tabName): array
    {
        if (!$this->isConfigured()) {
            throw new Exception('Google Sheets API is not configured or service account credentials are missing.');
        }

        try {
            $range = "'{$tabName}'!A1:Z1000";
            $response = $this->service->spreadsheets_values->get($this->spreadsheetId, $range);
            return $response->getValues() ?? [];
        } catch (Exception $e) {
            Log::error("Failed to read tab {$tabName}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Return all existing sheet tab names in the spreadsheet.
     */
    public function getExistingTabNames(): array
    {
        $spreadsheet = $this->service->spreadsheets->get($this->spreadsheetId);
        return array_map(
            fn($sheet) => $sheet->getProperties()->getTitle(),
            $spreadsheet->getSheets()
        );
    }

    /**
     * Create a sheet tab if it does not already exist.
     * Uses the batchUpdate API so writes never fail on a missing tab.
     */
    public function ensureTabExists(string $tabName): void
    {
        if (!$this->isConfigured()) {
            throw new Exception('Google Sheets API is not configured.');
        }

        try {
            $existingTabs = $this->getExistingTabNames();

            // Case-insensitive check for existing sheet title
            foreach ($existingTabs as $existing) {
                if (strcasecmp(trim($existing), trim($tabName)) === 0) {
                    return; // Tab already exists — nothing to do
                }
            }

            $addSheetRequest = new \Google\Service\Sheets\Request([
                'addSheet' => [
                    'properties' => [
                        'title' => $tabName,
                    ],
                ],
            ]);

            $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
                'requests' => [$addSheetRequest],
            ]);

            $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);

            Log::info("Created missing Google Sheet tab: '{$tabName}'");
        } catch (Exception $e) {
            if (str_contains(strtolower($e->getMessage()), 'already exists')) {
                Log::info("Tab '{$tabName}' already exists in Google Sheets.");
                return;
            }

            Log::error("Failed to create tab '{$tabName}': " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update or append values in a given tab.
     * Automatically creates the tab if it does not exist.
     */
    public function writeTabValues(string $tabName, array $rows): bool
    {
        if (!$this->isConfigured()) {
            throw new Exception('Google Sheets API is not configured.');
        }

        // Ensure the destination tab exists before writing
        $this->ensureTabExists($tabName);

        try {
            $body = new ValueRange([
                'values' => $rows
            ]);
            $params = ['valueInputOption' => 'USER_ENTERED'];
            $range = "'{$tabName}'!A1";

            $this->service->spreadsheets_values->update(
                $this->spreadsheetId,
                $range,
                $body,
                $params
            );

            return true;
        } catch (Exception $e) {
            Log::error("Failed to write to tab {$tabName}: " . $e->getMessage());
            throw $e;
        }
    }
}

