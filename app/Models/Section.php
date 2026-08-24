<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = [
        'google_sheet_id',
        'grade_level',
        'section_name',
        'program',
        'semester',
        'school_year',
        'status',
        'sync_status',
        'synced_at',
    ];

    protected $casts = [
        'synced_at' => 'datetime',
    ];

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'section_subjects', 'section_id', 'subject_id', 'section_name', 'subject_code');
    }
}
