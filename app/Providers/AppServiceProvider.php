<?php

namespace App\Providers;

use App\Models\Assignment;
use App\Models\Grade;
use App\Models\Instructor;
use App\Models\Program;
use App\Models\Section;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use App\Observers\AssignmentObserver;
use App\Observers\GradeObserver;
use App\Observers\InstructorObserver;
use App\Observers\ProgramObserver;
use App\Observers\SectionObserver;
use App\Observers\StudentObserver;
use App\Observers\SubjectObserver;
use App\Observers\UserObserver;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerObservers();
        $this->registerAuthEventListeners();
        $this->registerMigrationEventListeners();
    }

    /**
     * Register listeners for migration commands to ensure Google Sheets and local Excel sheets
     * purge stale records and match SQLite's clean state upon fresh migrations.
     */
    protected function registerMigrationEventListeners(): void
    {
        \Illuminate\Support\Facades\Event::listen(\Illuminate\Console\Events\CommandFinished::class, function (\Illuminate\Console\Events\CommandFinished $event) {
            if (in_array($event->command, ['migrate:fresh', 'migrate:refresh', 'migrate:reset'])) {
                try {
                    app(\App\Services\SheetSyncService::class)->pushToGoogle();
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning('Migration finished sheet sync notice: ' . $e->getMessage());
                }
            }
        });
    }

    /**
     * Register model observers for automatic Google Sheets sync.
     * Each observer dispatches a debounced, unique queue job on any data change.
     */
    protected function registerObservers(): void
    {
        User::observe(UserObserver::class);
        Student::observe(StudentObserver::class);
        Instructor::observe(InstructorObserver::class);
        Subject::observe(SubjectObserver::class);
        Section::observe(SectionObserver::class);
        Assignment::observe(AssignmentObserver::class);
        Grade::observe(GradeObserver::class);
        Program::observe(ProgramObserver::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Register listeners for authentication lifecycle events to audit logins, logouts, and failed attempts.
     */
    protected function registerAuthEventListeners(): void
    {
        \Illuminate\Support\Facades\Event::listen(\Illuminate\Auth\Events\Login::class, function (\Illuminate\Auth\Events\Login $event) {
            $user = $event->user;
            if ($user && ($user->isAdmin() || $user->isInstructor() || $user->isStudent())) {
                \App\Models\AdminAuditLog::create([
                    'email'      => $user->email,
                    'user_name'  => $user->name,
                    'role'       => $user->role,
                    'action'     => 'PORTAL_LOGIN',
                    'status'     => 'SUCCESS',
                    'details'    => 'Successfully authenticated into ' . ucfirst($user->role) . ' Portal',
                    'ip_address' => request()->ip() ?? '127.0.0.1',
                ]);
            }
        });

        \Illuminate\Support\Facades\Event::listen(\Illuminate\Auth\Events\Logout::class, function (\Illuminate\Auth\Events\Logout $event) {
            $user = $event->user;
            if ($user) {
                \App\Models\AdminAuditLog::create([
                    'email'      => $user->email,
                    'user_name'  => $user->name,
                    'role'       => $user->role ?? 'user',
                    'action'     => 'LOGOUT',
                    'status'     => 'SUCCESS',
                    'details'    => 'Successfully logged out of ' . ucfirst($user->role ?? 'user') . ' Portal',
                    'ip_address' => request()->ip() ?? '127.0.0.1',
                ]);
            }
        });

        \Illuminate\Support\Facades\Event::listen(\Illuminate\Auth\Events\Failed::class, function (\Illuminate\Auth\Events\Failed $event) {
            if (request()->attributes->get('admin_audit_log_created')) {
                return;
            }

            $email = $event->credentials['email'] ?? request()->input('email');
            $user = $event->user ?? ($email ? \App\Models\User::where('email', $email)->first() : null);

            if ($user) {
                \App\Models\AdminAuditLog::create([
                    'email'      => $user->email,
                    'user_name'  => $user->name,
                    'role'       => $user->role,
                    'action'     => 'FAILED_LOGIN',
                    'status'     => 'FAILED',
                    'details'    => 'Failed login attempt: Incorrect password',
                    'ip_address' => request()->ip() ?? '127.0.0.1',
                ]);
            } else {
                \App\Models\AdminAuditLog::create([
                    'email'      => $email,
                    'user_name'  => 'Unknown User',
                    'role'       => 'guest',
                    'action'     => 'FAILED_LOGIN',
                    'status'     => 'FAILED',
                    'details'    => 'Failed login attempt: Account not found (' . ($email ?: 'empty email') . ')',
                    'ip_address' => request()->ip() ?? '127.0.0.1',
                ]);
            }

            request()->attributes->set('admin_audit_log_created', true);
        });
    }
}

