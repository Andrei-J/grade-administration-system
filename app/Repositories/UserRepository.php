<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    public function getAll(): Collection
    {
        return User::orderBy('name')->get();
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        $data['sync_status'] = 'pending';
        return User::create($data);
    }

    public function update(User $user, array $data): bool
    {
        $data['sync_status'] = 'pending';
        return $user->update($data);
    }

    public function getPendingSync(): Collection
    {
        return User::where('sync_status', 'pending')->get();
    }

    public function markSynced(User $user, ?string $googleSheetId = null): void
    {
        $user->update([
            'sync_status' => 'synced',
            'synced_at' => now(),
            'google_sheet_id' => $googleSheetId ?? $user->google_sheet_id,
        ]);
    }
}
