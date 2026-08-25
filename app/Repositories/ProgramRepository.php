<?php

namespace App\Repositories;

use App\Models\Program;
use Illuminate\Database\Eloquent\Collection;

class ProgramRepository
{
    public function getAll(): Collection
    {
        return Program::orderBy('code', 'asc')->get();
    }

    public function findById(int $id): ?Program
    {
        return Program::find($id);
    }

    public function findByCode(string $code): ?Program
    {
        return Program::where('code', $code)->first();
    }

    public function create(array $data): Program
    {
        return Program::create($data);
    }

    public function update(Program $program, array $data): bool
    {
        return $program->update($data);
    }

    public function delete(Program $program): ?bool
    {
        return $program->delete();
    }
}
