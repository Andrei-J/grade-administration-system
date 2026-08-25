<?php

use App\Models\AdminAuditLog;
use App\Models\User;

test('successful login records a single PORTAL_LOGIN audit log', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'status' => 'Active',
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();

    $logs = AdminAuditLog::where('email', $user->email)
        ->where('action', 'PORTAL_LOGIN')
        ->get();

    expect($logs->count())->toBe(1);
    expect($logs->first()->status)->toBe('SUCCESS');
});

test('failed login attempt with wrong password records FAILED_LOGIN audit log', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'status' => 'Active',
    ]);

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();

    $log = AdminAuditLog::where('email', $user->email)
        ->where('action', 'FAILED_LOGIN')
        ->first();

    expect($log)->not->toBeNull();
    expect($log->status)->toBe('FAILED');
    expect($log->details)->toContain('Incorrect password');
});

test('failed login attempt with non existent email records FAILED_LOGIN audit log', function () {
    $nonExistentEmail = 'nonexistent_' . uniqid() . '@example.com';

    $this->post('/login', [
        'email' => $nonExistentEmail,
        'password' => 'somepassword',
    ]);

    $this->assertGuest();

    $log = AdminAuditLog::where('email', $nonExistentEmail)
        ->where('action', 'FAILED_LOGIN')
        ->first();

    expect($log)->not->toBeNull();
    expect($log->status)->toBe('FAILED');
    expect($log->user_name)->toBe('Unknown User');
});

test('user logout records LOGOUT audit log', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'status' => 'Active',
    ]);

    $this->actingAs($user)->post('/logout');

    $this->assertGuest();

    $log = AdminAuditLog::where('email', $user->email)
        ->where('action', 'LOGOUT')
        ->first();

    expect($log)->not->toBeNull();
    expect($log->status)->toBe('SUCCESS');
});

test('admin audit log controller index returns admin logs and access attempt logs', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'status' => 'Active',
    ]);

    AdminAuditLog::create([
        'email' => $admin->email,
        'user_name' => $admin->name,
        'role' => $admin->role,
        'action' => 'PORTAL_LOGIN',
        'status' => 'SUCCESS',
        'details' => 'Test log',
        'ip_address' => '127.0.0.1',
    ]);

    $response = $this->actingAs($admin)->get('/admin/audit-logs');

    $response->assertOk();
});
