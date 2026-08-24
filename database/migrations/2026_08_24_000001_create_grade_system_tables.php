<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('google_sheet_id')->nullable();
            $table->string('student_id')->unique();
            $table->string('name');
            $table->string('grade_level');
            $table->string('section');
            $table->string('school_year');
            $table->string('status')->default('Active');
            $table->string('sync_status')->default('synced');
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });

        Schema::create('instructors', function (Blueprint $table) {
            $table->id();
            $table->string('google_sheet_id')->nullable();
            $table->string('instructor_id')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('status')->default('Active');
            $table->string('sync_status')->default('synced');
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('google_sheet_id')->nullable();
            $table->string('subject_code')->unique();
            $table->string('subject_name');
            $table->text('description')->nullable();
            $table->string('status')->default('Active');
            $table->string('sync_status')->default('synced');
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });

        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('google_sheet_id')->nullable();
            $table->string('grade_level');
            $table->string('section_name');
            $table->string('school_year');
            $table->string('status')->default('Active');
            $table->string('sync_status')->default('synced');
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });

        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->string('google_sheet_id')->nullable();
            $table->string('instructor_id');
            $table->string('subject_id');
            $table->string('section_id');
            $table->string('school_year');
            $table->string('status')->default('Active');
            $table->string('sync_status')->default('synced');
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });

        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->string('google_sheet_id')->nullable();
            $table->string('student_id');
            $table->string('subject_id');
            $table->string('instructor_id');
            $table->string('section_id');
            $table->string('school_year');
            $table->decimal('prelim', 5, 2)->nullable();
            $table->decimal('midterm', 5, 2)->nullable();
            $table->decimal('final', 5, 2)->nullable();
            $table->decimal('final_average', 5, 2)->nullable();
            $table->string('status')->default('Pending');
            $table->string('sync_status')->default('synced');
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('google_sheet_id')->nullable();
            $table->string('user_id');
            $table->string('user_name')->nullable();
            $table->string('role');
            $table->string('grade_id')->nullable();
            $table->string('student_id')->nullable();
            $table->string('subject_id')->nullable();
            $table->string('action');
            $table->decimal('old_prelim', 5, 2)->nullable();
            $table->decimal('new_prelim', 5, 2)->nullable();
            $table->decimal('old_midterm', 5, 2)->nullable();
            $table->decimal('new_midterm', 5, 2)->nullable();
            $table->decimal('old_final', 5, 2)->nullable();
            $table->decimal('new_final', 5, 2)->nullable();
            $table->decimal('old_average', 5, 2)->nullable();
            $table->decimal('new_average', 5, 2)->nullable();
            $table->string('ip_address')->nullable();
            $table->string('sync_status')->default('synced');
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });

        Schema::create('sync_logs', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->nullable();
            $table->string('direction');
            $table->string('record_type')->nullable();
            $table->string('record_id')->nullable();
            $table->string('action')->default('SYNC');
            $table->string('status')->default('Success');
            $table->integer('records_count')->default(0);
            $table->text('details')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sync_logs');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('grades');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('sections');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('instructors');
        Schema::dropIfExists('students');
    }
};
