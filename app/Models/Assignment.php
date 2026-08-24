<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'google_sheet_id',
        'instructor_id',
        'subject_id',
        'section_id',
        'school_year',
        'semester',
        'prelim_weight',
        'midterm_weight',
        'final_weight',
        'status',
        'sync_status',
        'synced_at',
    ];

    protected $casts = [
        'prelim_weight' => 'float',
        'midterm_weight' => 'float',
        'final_weight' => 'float',
        'synced_at' => 'datetime',
    ];

    public function instructor()
    {
        return $this->belongsTo(Instructor::class, 'instructor_id', 'instructor_id');
    }

    public function resolvedInstructor(): ?Instructor
    {
        if (!empty($this->instructor_id)) {
            return Instructor::where('instructor_id', $this->instructor_id)
                ->orWhere('email', $this->instructor_id)
                ->first();
        }
        return null;
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

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id', 'subject_code');
    }
}

