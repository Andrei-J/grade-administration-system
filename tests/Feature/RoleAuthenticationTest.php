<?php

use App\Models\User;

test('admin can visit admin dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin', 'status' => 'Active']);

    $response = $this->actingAs($admin)->get('/admin/dashboard');

    $response->assertOk();
});

test('professor can visit instructor dashboard', function () {
    $professor = User::factory()->create(['role' => 'instructor', 'status' => 'Active']);

    $response = $this->actingAs($professor)->get('/instructor/dashboard');

    $response->assertOk();
});

test('student can visit student dashboard', function () {
    $student = User::factory()->create(['role' => 'student', 'status' => 'Active']);

    $response = $this->actingAs($student)->get('/student/dashboard');

    $response->assertOk();
});

test('student attempting admin route receives 403 forbidden', function () {
    $student = User::factory()->create(['role' => 'student', 'status' => 'Active']);

    $response = $this->actingAs($student)->get('/admin/students');

    $response->assertStatus(403);
});

test('professor attempting admin route receives 403 forbidden', function () {
    $professor = User::factory()->create(['role' => 'instructor', 'status' => 'Active']);

    $response = $this->actingAs($professor)->get('/admin/instructors');

    $response->assertStatus(403);
});

test('student registration route creates student account and profile', function () {
    $response = $this->post('/student-registration', [
        'name' => 'Jane Student',
        'email' => 'janestudent@example.com',
        'grade_level' => '1st Year',
        'section' => 'BSIT-1A',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertRedirect('/student/dashboard');

    $user = User::where('email', 'janestudent@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->role)->toBe('student');
    expect($user->profile_id)->not->toBeNull();
});
