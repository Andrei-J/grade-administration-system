<?php

namespace App\Repositories;

use App\Models\Section;
use Illuminate\Database\Eloquent\Collection;

class SectionRepository
{
    public function getAll(): Collection
    {
        return Section::orderBy('grade_level')->orderBy('section_name')->get();
    }

    public function findById(int $id): ?Section
    {
        return Section::find($id);
    }

    public function create(array $data): Section
    {
        $data['sync_status'] = 'pending';
        return Section::create($data);
    }

    public function update(Section $section, array $data): bool
    {
        $data['sync_status'] = 'pending';
        return $section->update($data);
    }

    public function getPendingSync(): Collection
    {
        return Section::where('sync_status', 'pending')->get();
    }

    public function markSynced(Section $section, ?string $googleSheetId = null): void
    {
        $section->update([
            'sync_status' => 'synced',
            'synced_at' => now(),
            'google_sheet_id' => $googleSheetId ?? $section->google_sheet_id,
        ]);
    }
}
