import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Save, CheckCircle, AlertTriangle, FileSpreadsheet, Lock, ShieldAlert, Percent, Settings2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Instructor', href: '/instructor/dashboard' },
    { title: 'My Classes', href: '/instructor/classes' },
    { title: 'Grade Encoding', href: '#' },
];

interface Student {
    id: number;
    student_id: string;
    name: string;
    grade_level: string;
    section: string;
}

interface GradeRecord {
    id?: number;
    student_id: string;
    prelim: number | null;
    midterm: number | null;
    final: number | null;
    final_average: number | null;
    status: string;
}

interface Assignment {
    id: number;
    subject_id: string;
    section_id: string;
    semester?: string;
    school_year: string;
    instructor_id: string;
    prelim_weight?: number;
    midterm_weight?: number;
    final_weight?: number;
    subject?: { subject_name: string };
}

interface Props {
    assignment: Assignment;
    students: Student[];
    grades: Record<string, GradeRecord>;
    isSubmissionDisabled?: boolean;
    submissionSettings?: {
        is_disabled?: boolean;
        disable_at?: string;
        enable_at?: string;
        message?: string;
    };
}

export default function GradeEncodingTable({
    assignment,
    students,
    grades: initialGrades,
    isSubmissionDisabled = false,
    submissionSettings,
}: Props) {
    const { flash } = usePage().props as any;

    const pw = assignment.prelim_weight ?? 30;
    const mw = assignment.midterm_weight ?? 30;
    const fw = assignment.final_weight ?? 40;

    const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
    const [weights, setWeights] = useState({
        prelim_weight: String(pw),
        midterm_weight: String(mw),
        final_weight: String(fw),
    });
    const [savingWeights, setSavingWeights] = useState(false);

    const weightSum =
        (parseFloat(weights.prelim_weight) || 0) +
        (parseFloat(weights.midterm_weight) || 0) +
        (parseFloat(weights.final_weight) || 0);

    const handleWeightSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Math.abs(weightSum - 100) > 0.01) return;

        setSavingWeights(true);
        router.post(
            `/instructor/classes/${assignment.id}/weights`,
            {
                prelim_weight: parseFloat(weights.prelim_weight),
                midterm_weight: parseFloat(weights.midterm_weight),
                final_weight: parseFloat(weights.final_weight),
            },
            {
                preserveScroll: true,
                onSuccess: () => setIsWeightModalOpen(false),
                onFinish: () => setSavingWeights(false),
            }
        );
    };

    const [gradeState, setGradeState] = useState<Record<string, { prelim: string; midterm: string; final: string }>>(() => {
        const state: Record<string, { prelim: string; midterm: string; final: string }> = {};
        students.forEach((st) => {
            const existing = initialGrades[st.student_id];
            state[st.student_id] = {
                prelim: existing?.prelim !== null && existing?.prelim !== undefined ? String(existing.prelim) : '',
                midterm: existing?.midterm !== null && existing?.midterm !== undefined ? String(existing.midterm) : '',
                final: existing?.final !== null && existing?.final !== undefined ? String(existing.final) : '',
            };
        });
        return state;
    });

    const [savingStudentId, setSavingStudentId] = useState<string | null>(null);

    // Modal state for grade confirmation
    const [confirmingStudent, setConfirmingStudent] = useState<{
        student: Student;
        prelim: string;
        midterm: string;
        final: string;
        average: number | null;
        status: string;
    } | null>(null);

    const computeLiveAverage = (stId: string): number | null => {
        const st = gradeState[stId];
        if (!st) return null;

        const p = parseFloat(st.prelim);
        const m = parseFloat(st.midterm);
        const f = parseFloat(st.final);

        if (isNaN(p) || isNaN(m) || isNaN(f)) return null;

        const totalW = pw + mw + fw || 100;
        const avg = (p * (pw / totalW)) + (m * (mw / totalW)) + (f * (fw / totalW));
        return Math.round(avg * 100) / 100;
    };

    const handleInputChange = (stId: string, field: 'prelim' | 'midterm' | 'final', value: string) => {
        if (isSubmissionDisabled) return;
        if (value !== '') {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0 || num > 100) {
                return;
            }
        }

        setGradeState((prev) => ({
            ...prev,
            [stId]: {
                ...prev[stId],
                [field]: value,
            },
        }));
    };

    const handleSaveClick = (st: Student) => {
        const liveAvg = computeLiveAverage(st.student_id);
        const existingGrade = initialGrades[st.student_id];
        const row = gradeState[st.student_id];
        const status = liveAvg !== null ? (liveAvg >= 75.0 ? 'Passed' : 'Failed') : (existingGrade?.status || 'Pending');

        setConfirmingStudent({
            student: st,
            prelim: row?.prelim || '',
            midterm: row?.midterm || '',
            final: row?.final || '',
            average: liveAvg,
            status: status,
        });
    };

    const saveGradeRow = (stId: string) => {
        if (isSubmissionDisabled) return;
        setSavingStudentId(stId);
        const row = gradeState[stId];

        router.post(
            '/instructor/grades',
            {
                student_id: stId,
                subject_id: assignment.subject_id,
                section_id: assignment.section_id,
                school_year: assignment.school_year,
                prelim: row.prelim !== '' ? parseFloat(row.prelim) : null,
                midterm: row.midterm !== '' ? parseFloat(row.midterm) : null,
                final: row.final !== '' ? parseFloat(row.final) : null,
                submit: true,
            },
            {
                preserveScroll: true,
                onFinish: () => setSavingStudentId(null),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Encode Grades — ${assignment.subject_id}`} />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                {/* Class Banner */}
                <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#4F6DF5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded">
                                {assignment.subject_id}
                            </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                                Section: {assignment.section_id}
                            </span>
                            {assignment.semester && (
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded ml-2">
                                    Semester: {assignment.semester}
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                            {assignment.subject?.subject_name || 'Subject Course'}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">School Year: {assignment.school_year}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <span className="text-xs text-slate-400 font-medium block">Grading Weight Distribution</span>
                            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                                Prelim: {pw}% • Midterm: {mw}% • Final: {fw}%
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsWeightModalOpen(!isWeightModalOpen)}
                            className="flex items-center gap-2 rounded-xl text-xs font-semibold border-slate-300 dark:border-slate-700"
                        >
                            <Settings2 className="w-4 h-4 text-blue-500" />
                            {isWeightModalOpen ? 'Close Weight Settings' : 'Change Grade Weights'}
                        </Button>
                    </div>
                </div>

                {/* Grade Weight Percentage Settings Panel */}
                {isWeightModalOpen && (
                    <Card className="border-blue-200 dark:border-blue-800/80 bg-blue-50/60 dark:bg-blue-950/30 p-5 rounded-2xl shadow-sm animate-in fade-in zoom-in-95 duration-150">
                        <form onSubmit={handleWeightSubmit} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Configure Custom Grade Weights (%)
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Set custom percentage breakdown for Prelim, Midterm, and Final grades. Total must equal 100%.
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                                        Math.abs(weightSum - 100) < 0.01
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                    }`}
                                >
                                    Total: {weightSum}%
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Prelim Weight (%)
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={weights.prelim_weight}
                                        onChange={(e) => setWeights({ ...weights, prelim_weight: e.target.value })}
                                        className="bg-white dark:bg-slate-800 mt-1 font-mono text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Midterm Weight (%)
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={weights.midterm_weight}
                                        onChange={(e) => setWeights({ ...weights, midterm_weight: e.target.value })}
                                        className="bg-white dark:bg-slate-800 mt-1 font-mono text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Final Weight (%)
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={weights.final_weight}
                                        onChange={(e) => setWeights({ ...weights, final_weight: e.target.value })}
                                        className="bg-white dark:bg-slate-800 mt-1 font-mono text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsWeightModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={savingWeights || Math.abs(weightSum - 100) > 0.01}
                                    className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white text-xs font-semibold"
                                >
                                    {savingWeights ? 'Saving Weights...' : 'Save Percentage Weights'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Grade Submission Disabled Banner */}
                {isSubmissionDisabled && (
                    <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-300 dark:border-rose-800/80 text-rose-900 dark:text-rose-200 flex items-start gap-4 shadow-sm">
                        <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-sm">
                            <p className="font-bold text-base text-rose-700 dark:text-rose-300">
                                Grade Submission Disabled
                            </p>
                            <p className="text-rose-800 dark:text-rose-200">
                                {submissionSettings?.message || 'Grade submission for all subjects and sections has been disabled by the system administrator.'}
                            </p>
                            {submissionSettings?.disable_at && (
                                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">
                                    Automated Lock Time: {new Date(submissionSettings.disable_at).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {flash?.success && (
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        {flash.error}
                    </div>
                )}

                {/* Grade Encoding Spreadsheet Table */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-[#4F6DF5] dark:text-indigo-400" />
                            Student Roster & Grade Encoding Sheet
                        </CardTitle>
                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                            Weights: P({pw}%) + M({mw}%) + F({fw}%)
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Student Name</th>
                                        <th className="p-3 w-32">Prelim ({pw}%)</th>
                                        <th className="p-3 w-32">Midterm ({mw}%)</th>
                                        <th className="p-3 w-32">Final ({fw}%)</th>
                                        <th className="p-3 w-32">Final Average</th>
                                        <th className="p-3 w-28 text-center">Status</th>
                                        <th className="p-3 w-32 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                No students enrolled in this section yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((st) => {
                                            const liveAvg = computeLiveAverage(st.student_id);
                                            const existingGrade = initialGrades[st.student_id];
                                            // Only lock if the grade is ALREADY saved as Passed in the database
                                            const isPassed = existingGrade?.status === 'Passed';

                                            return (
                                                <tr key={st.student_id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 ${isPassed ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''}`}>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="font-semibold text-slate-900 dark:text-white">{st.name}</p>
                                                            {isPassed && (
                                                                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 inline shrink-0" title="Grade locked (Passed in Database)" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs font-mono text-slate-400 dark:text-slate-500">{st.student_id}</p>
                                                    </td>

                                                    {/* Prelim Input */}
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            disabled={isSubmissionDisabled || isPassed}
                                                            value={gradeState[st.student_id]?.prelim || ''}
                                                            onChange={(e) => handleInputChange(st.student_id, 'prelim', e.target.value)}
                                                            placeholder="0-100"
                                                            className={`w-full text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md p-1.5 focus:ring-2 focus:ring-[#4F6DF5] ${
                                                                isSubmissionDisabled || isPassed ? 'opacity-65 cursor-not-allowed bg-slate-100 dark:bg-slate-800/80 text-slate-500' : ''
                                                            }`}
                                                        />
                                                    </td>

                                                    {/* Midterm Input */}
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            disabled={isSubmissionDisabled || isPassed}
                                                            value={gradeState[st.student_id]?.midterm || ''}
                                                            onChange={(e) => handleInputChange(st.student_id, 'midterm', e.target.value)}
                                                            placeholder="0-100"
                                                            className={`w-full text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md p-1.5 focus:ring-2 focus:ring-[#4F6DF5] ${
                                                                isSubmissionDisabled || isPassed ? 'opacity-65 cursor-not-allowed bg-slate-100 dark:bg-slate-800/80 text-slate-500' : ''
                                                            }`}
                                                        />
                                                    </td>

                                                    {/* Final Input */}
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            disabled={isSubmissionDisabled || isPassed}
                                                            value={gradeState[st.student_id]?.final || ''}
                                                            onChange={(e) => handleInputChange(st.student_id, 'final', e.target.value)}
                                                            placeholder="0-100"
                                                            className={`w-full text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md p-1.5 focus:ring-2 focus:ring-[#4F6DF5] ${
                                                                isSubmissionDisabled || isPassed ? 'opacity-65 cursor-not-allowed bg-slate-100 dark:bg-slate-800/80 text-slate-500' : ''
                                                            }`}
                                                        />
                                                    </td>

                                                    {/* Final Average (Calculated & Disabled) */}
                                                    <td className="p-3">
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                disabled
                                                                value={liveAvg !== null ? liveAvg.toFixed(2) : (existingGrade?.final_average ? Number(existingGrade.final_average).toFixed(2) : 'Auto')}
                                                                className="w-full text-sm font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 cursor-not-allowed pr-7"
                                                            />
                                                            <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2 top-2.5" />
                                                        </div>
                                                    </td>

                                                    {/* Status Badge */}
                                                    <td className="p-3 text-center">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                                (liveAvg !== null ? (liveAvg >= 75.0 ? 'Passed' : 'Failed') : (existingGrade?.status || 'Pending')) === 'Passed'
                                                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                                    : (liveAvg !== null ? (liveAvg >= 75.0 ? 'Passed' : 'Failed') : (existingGrade?.status || 'Pending')) === 'Failed'
                                                                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                            }`}
                                                        >
                                                            {liveAvg !== null ? (liveAvg >= 75.0 ? 'Passed' : 'Failed') : (existingGrade?.status || 'Pending')}
                                                        </span>
                                                    </td>

                                                    {/* Save Button */}
                                                    <td className="p-3 text-right">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSaveClick(st)}
                                                            disabled={isSubmissionDisabled || isPassed || savingStudentId === st.student_id}
                                                            className={`flex items-center gap-1 text-xs font-medium rounded-lg ${
                                                                isPassed
                                                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 opacity-80 cursor-not-allowed'
                                                                    : 'bg-[#4F6DF5] hover:bg-[#4058D6] text-white shadow-sm'
                                                            }`}
                                                        >
                                                            {isPassed ? (
                                                                <>
                                                                    <Lock className="w-3.5 h-3.5" />
                                                                    Passed
                                                                </>
                                                            ) : savingStudentId === st.student_id ? (
                                                                'Saving...'
                                                            ) : (
                                                                <>
                                                                    <Save className="w-3.5 h-3.5" />
                                                                    Save
                                                                </>
                                                            )}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Grade Confirmation Modal */}
                {confirmingStudent && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in duration-150">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Grade Submission</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Please review before saving</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setConfirmingStudent(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-800 text-xs">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-700">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">Student:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{confirmingStudent.student.name} ({confirmingStudent.student.student_id})</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center py-1">
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Prelim ({pw}%)</span>
                                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{confirmingStudent.prelim || 'N/A'}</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Midterm ({mw}%)</span>
                                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{confirmingStudent.midterm || 'N/A'}</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Final ({fw}%)</span>
                                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{confirmingStudent.final || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 dark:border-slate-700">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">Final Average:</span>
                                    <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                                        {confirmingStudent.average !== null ? confirmingStudent.average.toFixed(2) : 'Pending'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">Resulting Status:</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        confirmingStudent.status === 'Passed'
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                            : confirmingStudent.status === 'Failed'
                                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                        {confirmingStudent.status}
                                    </span>
                                </div>
                            </div>

                            {confirmingStudent.status === 'Passed' && (
                                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                                    <span>Saving a Passing grade (≥ 75.00) will finalize and lock this grade record in the database.</span>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setConfirmingStudent(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        const stId = confirmingStudent.student.student_id;
                                        setConfirmingStudent(null);
                                        saveGradeRow(stId);
                                    }}
                                    disabled={savingStudentId === confirmingStudent.student.student_id}
                                    className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white font-semibold text-xs"
                                >
                                    Confirm & Save Grade
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
