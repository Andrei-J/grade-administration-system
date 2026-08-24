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
        Schema::table('assignments', function (Blueprint $table) {
            $table->decimal('prelim_weight', 5, 2)->default(30.00)->after('school_year');
            $table->decimal('midterm_weight', 5, 2)->default(30.00)->after('prelim_weight');
            $table->decimal('final_weight', 5, 2)->default(40.00)->after('midterm_weight');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assignments', function (Blueprint $table) {
            $table->dropColumn(['prelim_weight', 'midterm_weight', 'final_weight']);
        });
    }
};
