<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\SyncLogRepository;
use App\Services\GoogleSheetsService;
use App\Services\LocalExcelSheetService;
use App\Services\SheetSyncService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SyncController extends Controller
{
    public function __construct(
        protected SheetSyncService $syncService,
        protected GoogleSheetsService $googleSheets,
        protected SyncLogRepository $syncLogRepo,
        protected LocalExcelSheetService $localExcelSheets
    ) {}

    public function index(): Response
    {
        $isConfigured = $this->googleSheets->isConfigured();
        $spreadsheetId = $this->googleSheets->getSpreadsheetId();
        $syncLogs = $this->syncLogRepo->getAll(20);
        $lastLog = $syncLogs->first();

        if ($this->localExcelSheets->isLocalSheetActive()) {
            $this->localExcelSheets->generateLocalExcelFile();
        }

        $localStats = $this->localExcelSheets->getLocalFileStats();

        return Inertia::render('settings/sync', [
            'googleStatus' => [
                'connected' => $isConfigured,
                'spreadsheet_id' => $spreadsheetId,
                'spreadsheet_name' => 'Secure Grade Administration System',
                'last_synced_at' => $lastLog?->created_at?->toDayDateTimeString() ?? 'Never',
                'last_status' => $lastLog?->status ?? 'Not Run Yet',
            ],
            'localSheet' => $localStats,
            'syncLogs' => $syncLogs,
        ]);
    }

    public function pull(Request $request)
    {
        $result = $this->syncService->pullFromGoogle($request->user()?->id);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function push(Request $request)
    {
        $result = $this->syncService->pushToGoogle($request->user()?->id);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function both(Request $request)
    {
        $result = $this->syncService->syncBothWays($request->user()?->id);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function toggleLocalSheet(Request $request)
    {
        $newStatus = $this->localExcelSheets->toggleLocalSheet();

        if ($newStatus) {
            return redirect()->back()->with('success', 'Local Excel sheet (.xlsx) activated successfully! Storage location: storage/app/sheets/grade_administration_local_sheets.xlsx');
        }

        return redirect()->back()->with('success', 'Local Excel sheet (.xlsx) deactivated.');
    }

    public function downloadLocalSheet()
    {
        // Always generate a fresh Excel file with latest DB records before download
        $this->localExcelSheets->generateLocalExcelFile();
        $path = $this->localExcelSheets->getLocalFilePath();

        return response()->download($path, 'grade_administration_local_sheets.xlsx', [
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
