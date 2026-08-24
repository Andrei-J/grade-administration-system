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
use App\Http\Controllers\Admin\GradeSubmissionControlController as AdminGradeSubmissionControlController;


use App\Http\Controllers\Instructor\DashboardController as InstructorDashboardController;
use App\Http\Controllers\Instructor\ClassController as InstructorClassController;
use App\Http\Controllers\Instructor\GradeController as InstructorGradeController;
use App\Http\Controllers\Instructor\AuditActivityController as InstructorAuditActivityController;

use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\GradeController as StudentGradeController;
use App\Http\Controllers\Student\RankingController as StudentRankingController;
use App\Http\Controllers\Student\SubjectController as StudentSubjectController;

use App\Http\Controllers\Auth\StudentRegistrationController;

Route::get('/', function (Request $request) {
    if ($request->user()) {
        return redirect()->route('dashboard');
    }
    return Inertia\Inertia::render('welcome');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/student-registration', [StudentRegistrationController::class, 'create'])->name('student.register');
    Route::post('/student-registration', [StudentRegistrationController::class, 'store']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        if ($user->isStudent()) {
            return redirect()->route('student.dashboard');
        }
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
    Route::post('/assignments/irregular-student', [AdminAssignmentController::class, 'addIrregularStudent'])->name('assignments.irregular');
    Route::post('/assignments/grade-submission-settings', [AdminAssignmentController::class, 'updateGradeSubmissionSettings'])->name('assignments.grade-submission-settings');

    // Grade Monitoring
    Route::get('/grades', [AdminGradeController::class, 'index'])->name('grades.index');

    // Dynamic Rankings
    Route::get('/rankings', [AdminRankingController::class, 'index'])->name('rankings.index');

    // Audit Logs
    Route::get('/audit-logs', [AdminAuditLogController::class, 'index'])->name('audit-logs.index');

    // Grade Submission Control & Automation
    Route::get('/submission-control', [AdminGradeSubmissionControlController::class, 'index'])->name('submission-control.index');
    Route::post('/submission-control', [AdminGradeSubmissionControlController::class, 'update'])->name('submission-control.update');
});


// Instructor Routes
Route::middleware(['auth', 'verified', EnsureRole::class . ':instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/dashboard', [InstructorDashboardController::class, 'index'])->name('dashboard');

    // Classes & Grade Encoding
    Route::get('/classes', [InstructorClassController::class, 'index'])->name('classes.index');
    Route::get('/classes/{id}', [InstructorClassController::class, 'show'])->name('classes.show');
    Route::post('/classes/{id}/weights', [InstructorClassController::class, 'updateWeights'])->name('classes.weights');
    Route::post('/grades', [InstructorGradeController::class, 'store'])->name('grades.store');

    // Instructor Audit Activity
    Route::get('/audit-activity', [InstructorAuditActivityController::class, 'index'])->name('audit-activity.index');
});

// Student Routes
Route::middleware(['auth', 'verified', EnsureRole::class . ':student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
    Route::get('/grades', [StudentGradeController::class, 'index'])->name('grades.index');
    Route::get('/ranking', [StudentRankingController::class, 'index'])->name('ranking.index');
    Route::get('/subjects', [StudentSubjectController::class, 'index'])->name('subjects.index');
    Route::post('/subjects/enroll', [StudentSubjectController::class, 'enroll'])->name('subjects.enroll');
});

require __DIR__.'/settings.php';
