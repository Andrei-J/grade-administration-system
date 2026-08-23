<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'google_sheet_id',
        'user_id',
        'user_name',
        'role',
        'grade_id',
        'student_id',
        'subject_id',
        'action',
        'old_prelim',
        'new_prelim',
        'old_midterm',
        'new_midterm',
        'old_final',
        'new_final',
        'old_average',
        'new_average',
        'ip_address',
        'sync_status',
        'synced_at',
    ];

    protected $casts = [
        'old_prelim' => 'float',
        'new_prelim' => 'float',
        'old_midterm' => 'float',
        'new_midterm' => 'float',
        'old_final' => 'float',
        'new_final' => 'float',
        'old_average' => 'float',
        'new_average' => 'float',
        'synced_at' => 'datetime',
    ];
}
