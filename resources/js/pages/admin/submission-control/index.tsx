import { useForm, usePage, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ShieldAlert, Lock, Unlock, Clock, Calendar, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Grade Submission Control', href: '/admin/submission-control' },
];

interface GradeSubmissionSettings {
    is_disabled?: boolean;
    disable_at?: string | null;
    enable_at?: string | null;
    message?: string | null;
}

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Props {
    gradeSubmissionSettings?: GradeSubmissionSettings;
    isSubmissionDisabled?: boolean;
}

export default function GradeSubmissionControl({
    gradeSubmissionSettings,
    isSubmissionDisabled = false,
}: Props) {
    const { flash } = usePage().props as PageProps;

    const settingsForm = useForm({
        is_disabled: gradeSubmissionSettings?.is_disabled ?? false,
        disable_at: gradeSubmissionSettings?.disable_at ? gradeSubmissionSettings.disable_at.slice(0, 16) : '',
        enable_at: gradeSubmissionSettings?.enable_at ? gradeSubmissionSettings.enable_at.slice(0, 16) : '',
        message: gradeSubmissionSettings?.message || 'Grade submission is currently disabled by the administration.',
    });

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        settingsForm.post('/admin/submission-control', {
            preserveScroll: true,
        });
    };

    const toggleDisableNow = (newStatus: boolean) => {
        settingsForm.setData('is_disabled', newStatus);
        router.post(
            '/admin/submission-control',
            {
                ...settingsForm.data,
                is_disabled: newStatus,
            },
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grade Submission Control & Automation" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                            <ShieldAlert className="w-7 h-7 text-[#4F6DF5] dark:text-indigo-400 shrink-0" />
                            Grade Submission Control & Automation Setter
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Disable grade encoding and submission for all professors across all subjects, or schedule automated locking and unlocking.
                        </p>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Live Status Banner */}
                <div
                    className={`p-6 rounded-2xl border shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isSubmissionDisabled
                            ? 'bg-rose-500/10 border-rose-300 dark:border-rose-800/80 text-rose-950 dark:text-rose-100'
                            : 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
                    }`}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className={`p-3 rounded-xl shrink-0 ${
                                isSubmissionDisabled
                                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                            }`}
                        >
                            {isSubmissionDisabled ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">System Grade Submission Status:</span>
                                <span
                                    className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                                        isSubmissionDisabled
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-emerald-600 text-white'
                                    }`}
                                >
                                    {isSubmissionDisabled ? 'LOCKED / DISABLED' : 'OPEN / ACTIVE'}
                                </span>
                            </div>
                            <p className="text-sm opacity-90">
                                {isSubmissionDisabled
                                    ? 'All professors are currently BLOCKED from saving or submitting student grades in all subjects.'
                                    : 'Professors are currently ALLOWED to save and submit grades normally.'}
                            </p>
                            {gradeSubmissionSettings?.disable_at && (
                                <p className="text-xs font-mono pt-1 text-slate-600 dark:text-slate-400">
                                    Automated Lock Time: {new Date(gradeSubmissionSettings.disable_at).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Control Panel Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Instant Manual Toggle Box */}
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Lock className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                Instant Manual Override
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Use this button to instantly toggle submission access for all instructors without needing to configure scheduled dates.
                                </p>
                                <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <span>Manual toggle takes immediate effect across the entire system.</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                {isSubmissionDisabled ? (
                                    <Button
                                        type="button"
                                        onClick={() => toggleDisableNow(false)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <Unlock className="w-4 h-4" />
                                        Enable All Submissions Now
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => toggleDisableNow(true)}
                                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <Lock className="w-4 h-4" />
                                        Disable All Submissions Now
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Automation Date & Time Setter Form */}
                    <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#4F6DF5] dark:text-indigo-400" />
                                Date & Time Automation Setter
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <form onSubmit={handleSettingsSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-rose-500" />
                                            Automated Disable Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={settingsForm.data.disable_at}
                                            onChange={(e) => settingsForm.setData('disable_at', e.target.value)}
                                            className="w-full text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-[#4F6DF5]"
                                        />
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                                            When the system clock reaches this exact date & time, grade submission will automatically lock.
                                        </p>
                                    </div>

                                    <div className="space-y-1.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-emerald-500" />
                                            Automated Re-enable Date & Time (Optional)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={settingsForm.data.enable_at}
                                            onChange={(e) => settingsForm.setData('enable_at', e.target.value)}
                                            className="w-full text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-[#4F6DF5]"
                                        />
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                                            When the system clock reaches this timestamp, grade submission will automatically re-open.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Instructor Banner Notice Message
                                    </label>
                                    <input
                                        type="text"
                                        value={settingsForm.data.message}
                                        onChange={(e) => settingsForm.setData('message', e.target.value)}
                                        placeholder="Grade submission is currently disabled by administration."
                                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 focus:ring-2 focus:ring-[#4F6DF5]"
                                    />
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                        This message will be shown to instructors on their grade encoding page when submission is locked.
                                    </p>
                                </div>

                                <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <Button
                                        type="submit"
                                        disabled={settingsForm.processing}
                                        className="bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-sm"
                                    >
                                        Save Automation Settings
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
