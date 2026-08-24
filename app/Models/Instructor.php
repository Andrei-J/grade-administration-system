<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    use HasFactory;

    protected $fillable = [
        'google_sheet_id',
        'instructor_id',
        'name',
        'email',
        'status',
        'sync_status',
        'synced_at',
    ];

    protected $casts = [
        'synced_at' => 'datetime',
    ];

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'instructor_id', 'instructor_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'profile_id', 'instructor_id');
    }
}
