<?php

namespace App\Repositories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Collection;

class StudentRepository
{
    public function getAll(array $filters = []): Collection
    {
        $query = Student::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['grade_level'])) {
            $query->where('grade_level', $filters['grade_level']);
        }

        if (!empty($filters['section'])) {
            $query->where('section', $filters['section']);
        }

        if (!empty($filters['school_year'])) {
            $query->where('school_year', $filters['school_year']);
        }

        return $query->orderBy('name')->get();
    }

    public function findByStudentId(string $studentId): ?Student
    {
        return Student::where('student_id', $studentId)->first();
    }

    public function findById(int $id): ?Student
    {
        return Student::find($id);
    }

    public function create(array $data): Student
    {
        $data['sync_status'] = 'pending';
        return Student::create($data);
    }

    public function update(Student $student, array $data): bool
    {
        $data['sync_status'] = 'pending';
        return $student->update($data);
    }

    public function delete(Student $student): bool
    {
        return $student->delete();
    }

    public function getPendingSync(): Collection
    {
        return Student::where('sync_status', 'pending')->get();
    }

    public function markSynced(Student $student, ?string $googleSheetId = null): void
    {
        $student->update([
            'sync_status' => 'synced',
            'synced_at' => now(),
            'google_sheet_id' => $googleSheetId ?? $student->google_sheet_id,
        ]);
    }
}
