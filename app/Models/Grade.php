<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'google_sheet_id',
        'student_id',
        'subject_id',
        'instructor_id',
        'section_id',
        'school_year',
        'semester',
        'prelim',
        'midterm',
        'final',
        'final_average',
        'status',
        'sync_status',
        'synced_at',
    ];

    protected $casts = [
        'prelim' => 'float',
        'midterm' => 'float',
        'final' => 'float',
        'final_average' => 'float',
        'synced_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id', 'subject_code');
    }

    public function instructor()
    {
        return $this->belongsTo(Instructor::class, 'instructor_id', 'instructor_id');
    }

    public function getInstructorNameAttribute(): string
    {
        if ($this->instructor && !empty($this->instructor->name)) {
            return $this->instructor->name;
        }

        if (!empty($this->instructor_id)) {
            $inst = Instructor::where('instructor_id', $this->instructor_id)
                ->orWhere('email', $this->instructor_id)
                ->orWhere('id', $this->instructor_id)
                ->first();

            if ($inst && !empty($inst->name)) {
                return $inst->name;
            }

            $user = User::where('email', $this->instructor_id)
                ->orWhere('profile_id', $this->instructor_id)
                ->orWhere('id', $this->instructor_id)
                ->first();

            if ($user && !empty($user->name)) {
                return $user->name;
            }
        }

        return 'Unassigned';
    }
}

