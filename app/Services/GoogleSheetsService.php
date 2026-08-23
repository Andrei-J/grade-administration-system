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
     * Update or append values in a given tab.
     */
    public function writeTabValues(string $tabName, array $rows): bool
    {
        if (!$this->isConfigured()) {
            throw new Exception('Google Sheets API is not configured.');
        }

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
