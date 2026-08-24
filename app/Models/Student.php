<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'google_sheet_id',
        'student_id',
        'name',
        'grade_level',
        'section',
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

    public function grades()
    {
        return $this->hasMany(Grade::class, 'student_id', 'student_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'profile_id', 'student_id');
    }
}
