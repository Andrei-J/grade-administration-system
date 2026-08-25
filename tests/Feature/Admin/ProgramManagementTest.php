<?php

use App\Models\Program;
use App\Models\User;

test('admin can view programs index page', function () {
    $admin = User::factory()->create(['role' => 'admin', 'status' => 'Active']);

    $response = $this->actingAs($admin)->get('/admin/programs');

    $response->assertStatus(200);
});

test('admin can create a new program', function () {
    $admin = User::factory()->create(['role' => 'admin', 'status' => 'Active']);

    $response = $this->actingAs($admin)->post('/admin/programs', [
        'code' => 'BSCE',
        'name' => 'Bachelor of Science in Civil Engineering',
        'description' => 'Structural and civil engineering program.',
        'status' => 'Active',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('programs', [
        'code' => 'BSCE',
        'name' => 'Bachelor of Science in Civil Engineering',
    ]);
});

test('admin can update a program', function () {
    $admin = User::factory()->create(['role' => 'admin', 'status' => 'Active']);
    $program = Program::create([
        'code' => 'BSEE',
        'name' => 'Electrical Engineering',
        'status' => 'Active',
    ]);

    $response = $this->actingAs($admin)->put("/admin/programs/{$program->id}", [
        'code' => 'BSEE',
        'name' => 'Bachelor of Science in Electrical Engineering',
        'description' => 'Power systems and electronics specialization.',
        'status' => 'Active',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('programs', [
        'id' => $program->id,
        'name' => 'Bachelor of Science in Electrical Engineering',
    ]);
});

test('admin can delete a program', function () {
    $admin = User::factory()->create(['role' => 'admin', 'status' => 'Active']);
    $program = Program::create([
        'code' => 'BSCpE',
        'name' => 'Computer Engineering',
        'status' => 'Active',
    ]);

    $response = $this->actingAs($admin)->delete("/admin/programs/{$program->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('programs', [
        'id' => $program->id,
    ]);
});
