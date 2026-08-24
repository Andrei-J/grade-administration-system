<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    public static function getSetting(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function setSetting(string $key, $value)
    {
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }

    public static function isGradeSubmissionDisabled(): bool
    {
        $setting = static::getSetting('grade_submission');
        if (!$setting) {
            return false;
        }

        $isDisabled = !empty($setting['is_disabled']);
        $disableAt = !empty($setting['disable_at']) ? Carbon::parse($setting['disable_at']) : null;
        $enableAt = !empty($setting['enable_at']) ? Carbon::parse($setting['enable_at']) : null;
        $now = now();

        if ($enableAt && $now->greaterThanOrEqualTo($enableAt)) {
            return false;
        }

        if ($isDisabled) {
            return true;
        }

        if ($disableAt && $now->greaterThanOrEqualTo($disableAt)) {
            return true;
        }

        return false;
    }
}
