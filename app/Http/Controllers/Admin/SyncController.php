<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SheetSyncService;
use App\Services\GoogleSheetsService;
use App\Repositories\SyncLogRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SyncController extends Controller
{
    public function __construct(
        protected SheetSyncService $syncService,
        protected GoogleSheetsService $googleSheets,
        protected SyncLogRepository $syncLogRepo
    ) {}

    public function index(): Response
    {
        $isConfigured = $this->googleSheets->isConfigured();
        $spreadsheetId = $this->googleSheets->getSpreadsheetId();
        $syncLogs = $this->syncLogRepo->getAll(20);
        $lastLog = $syncLogs->first();

        return Inertia::render('settings/sync', [
            'googleStatus' => [
                'connected' => $isConfigured,
                'spreadsheet_id' => $spreadsheetId,
                'spreadsheet_name' => 'Secure Grade Administration System',
                'last_synced_at' => $lastLog?->created_at?->toDayDateTimeString() ?? 'Never',
                'last_status' => $lastLog?->status ?? 'Not Run Yet',
            ],
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
}
