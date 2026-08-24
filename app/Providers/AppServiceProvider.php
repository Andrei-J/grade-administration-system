<?php

namespace App\Providers;

use App\Models\Assignment;
use App\Models\Grade;
use App\Models\Instructor;
use App\Models\Section;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use App\Observers\AssignmentObserver;
use App\Observers\GradeObserver;
use App\Observers\InstructorObserver;
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
}

