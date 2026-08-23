<?php

namespace App\Repositories;

use App\Models\SyncLog;
use Illuminate\Database\Eloquent\Collection;

class SyncLogRepository
{
    public function getAll(int $limit = 50): Collection
    {
        return SyncLog::with('user')->orderBy('created_at', 'desc')->limit($limit)->get();
    }

    public function create(array $data): SyncLog
    {
        return SyncLog::create($data);
    }
}
