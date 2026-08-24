<?php

use App\Http\Controllers\Settings\GoogleSheetsConfigController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Google Sheets configuration — admin only
    Route::middleware('admin')->group(function () {
        Route::get('settings/profile/google-sheets', [GoogleSheetsConfigController::class, 'show'])->name('google-sheets.show');
        Route::post('settings/profile/google-sheets', [GoogleSheetsConfigController::class, 'save'])->name('google-sheets.save');
        Route::post('settings/profile/google-sheets/test', [GoogleSheetsConfigController::class, 'testConnection'])->name('google-sheets.test');
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])
        ->middleware(RequirePassword::class)
        ->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');

    // Data Synchronization
    Route::get('settings/sync', [\App\Http\Controllers\Admin\SyncController::class, 'index'])->name('sync.index');
    Route::post('settings/sync/pull', [\App\Http\Controllers\Admin\SyncController::class, 'pull'])->name('sync.pull');
    Route::post('settings/sync/push', [\App\Http\Controllers\Admin\SyncController::class, 'push'])->name('sync.push');
    Route::post('settings/sync/both', [\App\Http\Controllers\Admin\SyncController::class, 'both'])->name('sync.both');
    Route::post('settings/sync/toggle-local', [\App\Http\Controllers\Admin\SyncController::class, 'toggleLocalSheet'])->name('sync.toggle-local');
    Route::get('settings/sync/download-local', [\App\Http\Controllers\Admin\SyncController::class, 'downloadLocalSheet'])->name('sync.download-local');
});

Route::get('.well-known/passkey-endpoints', function () {
    return response()->json([
        'enroll' => route('security.edit'),
        'manage' => route('security.edit'),
    ]);
})->name('well-known.passkeys');
