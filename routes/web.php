<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Middleware\EnsureRole;

// Controllers
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\StudentController as AdminStudentController;
use App\Http\Controllers\Admin\InstructorController as AdminInstructorController;
use App\Http\Controllers\Admin\SubjectController as AdminSubjectController;
use App\Http\Controllers\Admin\SectionController as AdminSectionController;
use App\Http\Controllers\Admin\AssignmentController as AdminAssignmentController;
use App\Http\Controllers\Admin\GradeController as AdminGradeController;
use App\Http\Controllers\Admin\RankingController as AdminRankingController;
use App\Http\Controllers\Admin\AuditLogController as AdminAuditLogController;

use App\Http\Controllers\Instructor\DashboardController as InstructorDashboardController;
use App\Http\Controllers\Instructor\ClassController as InstructorClassController;
use App\Http\Controllers\Instructor\GradeController as InstructorGradeController;
use App\Http\Controllers\Instructor\AuditActivityController as InstructorAuditActivityController;

Route::get('/', function (Request $request) {
    if ($request->user()) {
        return redirect()->route('dashboard');
    }
    return Inertia\Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        if ($user->isInstructor()) {
            return redirect()->route('instructor.dashboard');
        }
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});

// Admin Routes
Route::middleware(['auth', 'verified', EnsureRole::class . ':admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Student Management
    Route::get('/students', [AdminStudentController::class, 'index'])->name('students.index');
    Route::post('/students', [AdminStudentController::class, 'store'])->name('students.store');
    Route::put('/students/{id}', [AdminStudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{id}', [AdminStudentController::class, 'destroy'])->name('students.destroy');

    // Instructor Management
    Route::get('/instructors', [AdminInstructorController::class, 'index'])->name('instructors.index');
    Route::post('/instructors', [AdminInstructorController::class, 'store'])->name('instructors.store');
    Route::put('/instructors/{id}', [AdminInstructorController::class, 'update'])->name('instructors.update');

    // Subject Management
    Route::get('/subjects', [AdminSubjectController::class, 'index'])->name('subjects.index');
    Route::post('/subjects', [AdminSubjectController::class, 'store'])->name('subjects.store');
    Route::put('/subjects/{id}', [AdminSubjectController::class, 'update'])->name('subjects.update');

    // Section Management
    Route::get('/sections', [AdminSectionController::class, 'index'])->name('sections.index');
    Route::post('/sections', [AdminSectionController::class, 'store'])->name('sections.store');
    Route::put('/sections/{id}', [AdminSectionController::class, 'update'])->name('sections.update');

    // Class Assignments
    Route::get('/assignments', [AdminAssignmentController::class, 'index'])->name('assignments.index');
    Route::post('/assignments', [AdminAssignmentController::class, 'store'])->name('assignments.store');
    Route::put('/assignments/{id}', [AdminAssignmentController::class, 'update'])->name('assignments.update');

    // Grade Monitoring
    Route::get('/grades', [AdminGradeController::class, 'index'])->name('grades.index');

    // Dynamic Rankings
    Route::get('/rankings', [AdminRankingController::class, 'index'])->name('rankings.index');

    // Audit Logs
    Route::get('/audit-logs', [AdminAuditLogController::class, 'index'])->name('audit-logs.index');
});

// Instructor Routes
Route::middleware(['auth', 'verified', EnsureRole::class . ':instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/dashboard', [InstructorDashboardController::class, 'index'])->name('dashboard');

    // Classes & Grade Encoding
    Route::get('/classes', [InstructorClassController::class, 'index'])->name('classes.index');
    Route::get('/classes/{id}', [InstructorClassController::class, 'show'])->name('classes.show');
    Route::post('/grades', [InstructorGradeController::class, 'store'])->name('grades.store');

    // Instructor Audit Activity
    Route::get('/audit-activity', [InstructorAuditActivityController::class, 'index'])->name('audit-activity.index');
});

require __DIR__.'/settings.php';
