<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('students', 'program')) {
            Schema::table('students', function (Blueprint $table) {
                $table->string('program')->default('BSAIT')->after('section');
                $table->string('semester')->default('1st Semester')->after('program');
            });
        }

        if (!Schema::hasColumn('sections', 'program')) {
            Schema::table('sections', function (Blueprint $table) {
                $table->string('program')->default('BSAIT')->after('section_name');
                $table->string('semester')->default('1st Semester')->after('program');
            });
        }

        if (!Schema::hasColumn('assignments', 'semester')) {
            Schema::table('assignments', function (Blueprint $table) {
                $table->string('semester')->default('1st Semester')->after('school_year');
            });
        }

        if (!Schema::hasColumn('grades', 'semester')) {
            Schema::table('grades', function (Blueprint $table) {
                $table->string('semester')->default('1st Semester')->after('school_year');
            });
        }

        // Update all existing records to ensure program='BSAIT' and semester='1st Semester'
        DB::table('students')->update([
            'program' => 'BSAIT',
            'semester' => '1st Semester',
        ]);

        DB::table('sections')->update([
            'program' => 'BSAIT',
            'semester' => '1st Semester',
        ]);

        DB::table('assignments')->update([
            'semester' => '1st Semester',
        ]);

        DB::table('grades')->update([
            'semester' => '1st Semester',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('students', 'program')) {
            Schema::table('students', function (Blueprint $table) {
                $table->dropColumn(['program', 'semester']);
            });
        }

        if (Schema::hasColumn('sections', 'program')) {
            Schema::table('sections', function (Blueprint $table) {
                $table->dropColumn(['program', 'semester']);
            });
        }

        if (Schema::hasColumn('assignments', 'semester')) {
            Schema::table('assignments', function (Blueprint $table) {
                $table->dropColumn(['semester']);
            });
        }

        if (Schema::hasColumn('grades', 'semester')) {
            Schema::table('grades', function (Blueprint $table) {
                $table->dropColumn(['semester']);
            });
        }
    }
};
