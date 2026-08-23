<?php

namespace App\Repositories;

use App\Models\Instructor;
use Illuminate\Database\Eloquent\Collection;

class InstructorRepository
{
    public function getAll(array $filters = []): Collection
    {
        $query = Instructor::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('instructor_id', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('name')->get();
    }

    public function findByInstructorId(string $instructorId): ?Instructor
    {
        return Instructor::where('instructor_id', $instructorId)->first();
    }

    public function findByEmail(string $email): ?Instructor
    {
        return Instructor::where('email', $email)->first();
    }

    public function create(array $data): Instructor
    {
        $data['sync_status'] = 'pending';
        return Instructor::create($data);
    }

    public function update(Instructor $instructor, array $data): bool
    {
        $data['sync_status'] = 'pending';
        return $instructor->update($data);
    }

    public function getPendingSync(): Collection
    {
        return Instructor::where('sync_status', 'pending')->get();
    }

    public function markSynced(Instructor $instructor, ?string $googleSheetId = null): void
    {
        $instructor->update([
            'sync_status' => 'synced',
            'synced_at' => now(),
            'google_sheet_id' => $googleSheetId ?? $instructor->google_sheet_id,
        ]);
    }
}
