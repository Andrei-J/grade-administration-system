<?php

namespace App\Repositories;

use App\Models\Assignment;
use App\Models\Instructor;
use Illuminate\Database\Eloquent\Collection;

class AssignmentRepository
{
    public function getAll(): Collection
    {
        $assignments = Assignment::with(['instructor', 'subject'])->orderBy('school_year', 'desc')->get();

        // Resolve instructor names for rows that stored email instead of instructor_id
        $assignments->each(function ($asgn) {
            if (!$asgn->instructor && !empty($asgn->instructor_id)) {
                $resolved = Instructor::where('instructor_id', $asgn->instructor_id)
                    ->orWhere('email', $asgn->instructor_id)
                    ->first();
                if ($resolved) {
                    $asgn->setRelation('instructor', $resolved);
                }
            }
        });

        return $assignments;
    }

    public function getForInstructor(string $instructorId): Collection
    {
        return Assignment::with(['instructor', 'subject'])
            ->where('instructor_id', $instructorId)
            ->where('status', 'Active')
            ->get();
    }

    public function findAssignment(string $instructorId, string $subjectId, string $sectionId, string $schoolYear): ?Assignment
    {
        return Assignment::where('instructor_id', $instructorId)
            ->where('subject_id', $subjectId)
            ->where('section_id', $sectionId)
            ->where('school_year', $schoolYear)
            ->first();
    }

    public function isAssigned(string $instructorId, string $subjectId, string $sectionId, string $schoolYear): bool
    {
        return Assignment::where('instructor_id', $instructorId)
            ->where('subject_id', $subjectId)
            ->where('section_id', $sectionId)
            ->where('school_year', $schoolYear)
            ->where('status', 'Active')
            ->exists();
    }

    public function create(array $data): Assignment
    {
        $data['sync_status'] = 'pending';
        return Assignment::create($data);
    }

    public function update(Assignment $assignment, array $data): bool
    {
        $data['sync_status'] = 'pending';
        return $assignment->update($data);
    }

    public function getPendingSync(): Collection
    {
        return Assignment::where('sync_status', 'pending')->get();
    }

    public function markSynced(Assignment $assignment, ?string $googleSheetId = null): void
    {
        $assignment->update([
            'sync_status' => 'synced',
            'synced_at' => now(),
            'google_sheet_id' => $googleSheetId ?? $assignment->google_sheet_id,
        ]);
    }
}
