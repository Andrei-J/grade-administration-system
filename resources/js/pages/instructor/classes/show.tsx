import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Save, CheckCircle, AlertTriangle, FileSpreadsheet, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    school_year: string;
    instructor_id: string;
    subject?: { subject_name: string };
}

interface Props {
    assignment: Assignment;
    students: Student[];
    grades: Record<string, GradeRecord>;
}

export default function GradeEncodingTable({ assignment, students, grades: initialGrades }: Props) {
    const { flash } = usePage().props as any;

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

    const computeLiveAverage = (stId: string): number | null => {
        const st = gradeState[stId];
        if (!st) return null;

        const p = parseFloat(st.prelim);
        const m = parseFloat(st.midterm);
        const f = parseFloat(st.final);

        if (isNaN(p) || isNaN(m) || isNaN(f)) return null;

        return Math.round(((p + m + f) / 3.0) * 100) / 100;
    };

    const handleInputChange = (stId: string, field: 'prelim' | 'midterm' | 'final', value: string) => {
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

    const saveGradeRow = (stId: string) => {
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
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                            {assignment.subject?.subject_name || 'Subject Course'}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">School Year: {assignment.school_year}</p>
                    </div>
                </div>

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
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-[#4F6DF5] dark:text-indigo-400" />
                            Student Roster & Grade Encoding Sheet
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Student Name</th>
                                        <th className="p-3 w-28">Prelim (0-100)</th>
                                        <th className="p-3 w-28">Midterm (0-100)</th>
                                        <th className="p-3 w-28">Final (0-100)</th>
                                        <th className="p-3 w-32">Final Average</th>
                                        <th className="p-3 w-28 text-center">Status</th>
                                        <th className="p-3 w-24 text-right">Action</th>
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
                                            const status = liveAvg !== null ? (liveAvg >= 75.0 ? 'Passed' : 'Failed') : 'Pending';

                                            return (
                                                <tr key={st.student_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                    <td className="p-3">
                                                        <p className="font-semibold text-slate-900 dark:text-white">{st.name}</p>
                                                        <p className="text-xs font-mono text-slate-400 dark:text-slate-500">{st.student_id}</p>
                                                    </td>

                                                    {/* Prelim Input */}
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            value={gradeState[st.student_id]?.prelim || ''}
                                                            onChange={(e) => handleInputChange(st.student_id, 'prelim', e.target.value)}
                                                            placeholder="0-100"
                                                            className="w-full text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md p-1.5 focus:ring-2 focus:ring-[#4F6DF5]"
                                                        />
                                                    </td>

                                                    {/* Midterm Input */}
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            value={gradeState[st.student_id]?.midterm || ''}
                                                            onChange={(e) => handleInputChange(st.student_id, 'midterm', e.target.value)}
                                                            placeholder="0-100"
                                                            className="w-full text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md p-1.5 focus:ring-2 focus:ring-[#4F6DF5]"
                                                        />
                                                    </td>

                                                    {/* Final Input */}
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            value={gradeState[st.student_id]?.final || ''}
                                                            onChange={(e) => handleInputChange(st.student_id, 'final', e.target.value)}
                                                            placeholder="0-100"
                                                            className="w-full text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md p-1.5 focus:ring-2 focus:ring-[#4F6DF5]"
                                                        />
                                                    </td>

                                                    {/* Final Average (Calculated & Disabled) */}
                                                    <td className="p-3">
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                disabled
                                                                value={liveAvg !== null ? liveAvg.toFixed(2) : 'Auto'}
                                                                className="w-full text-sm font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 cursor-not-allowed pr-7"
                                                            />
                                                            <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2 top-2.5" />
                                                        </div>
                                                    </td>

                                                    {/* Status Badge */}
                                                    <td className="p-3 text-center">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                                status === 'Passed'
                                                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                                    : status === 'Failed'
                                                                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                            }`}
                                                        >
                                                            {status}
                                                        </span>
                                                    </td>

                                                    {/* Save Button */}
                                                    <td className="p-3 text-right">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => saveGradeRow(st.student_id)}
                                                            disabled={savingStudentId === st.student_id}
                                                            className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white flex items-center gap-1"
                                                        >
                                                            <Save className="w-3.5 h-3.5" />
                                                            Save
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
            </div>
        </AppLayout>
    );
}
