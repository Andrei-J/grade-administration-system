<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'google_sheet_id',
        'subject_code',
        'subject_name',
        'description',
        'status',
        'sync_status',
        'synced_at',
    ];

    protected $casts = [
        'synced_at' => 'datetime',
    ];

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'subject_id', 'subject_code');
    }
}
