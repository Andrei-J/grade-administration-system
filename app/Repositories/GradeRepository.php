<?php

namespace App\Repositories;

use App\Models\Grade;
use Illuminate\Database\Eloquent\Collection;

class GradeRepository
{
    public function getAll(array $filters = []): Collection
    {
        $query = Grade::with(['student', 'subject', 'instructor']);

        if (!empty($filters['student_id'])) {
            $query->where('student_id', $filters['student_id']);
        }
        if (!empty($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }
        if (!empty($filters['instructor_id'])) {
            $query->where('instructor_id', $filters['instructor_id']);
        }
        if (!empty($filters['section_id'])) {
            $query->where('section_id', $filters['section_id']);
        }
        if (!empty($filters['school_year'])) {
            $query->where('school_year', $filters['school_year']);
        }

        return $query->get();
    }

    public function findById(int $id): ?Grade
    {
        return Grade::with(['student', 'subject', 'instructor'])->find($id);
    }

    public function findGrade(string $studentId, string $subjectId, string $sectionId, string $schoolYear): ?Grade
    {
        return Grade::where('student_id', $studentId)
            ->where('subject_id', $subjectId)
            ->where('section_id', $sectionId)
            ->where('school_year', $schoolYear)
            ->first();
    }

    public function createOrUpdate(array $keys, array $values): Grade
    {
        $values['sync_status'] = 'pending';
        return Grade::updateOrCreate($keys, $values);
    }

    public function getPendingSync(): Collection
    {
        return Grade::where('sync_status', 'pending')->get();
    }

    public function markSynced(Grade $grade, ?string $googleSheetId = null): void
    {
        $grade->update([
            'sync_status' => 'synced',
            'synced_at' => now(),
            'google_sheet_id' => $googleSheetId ?? $grade->google_sheet_id,
        ]);
    }
}
