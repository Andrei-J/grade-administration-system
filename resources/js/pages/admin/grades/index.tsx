import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FileSpreadsheet, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'System-wide Grade Records', href: '/admin/grades' },
];

interface Grade {
    id: number;
    student_id: string;
    subject_id: string;
    instructor_id: string;
    section_id: string;
    school_year: string;
    prelim: number | null;
    midterm: number | null;
    final: number | null;
    final_average: number | null;
    status: string;
    student?: { name: string };
    subject?: { subject_name: string };
}

interface Props {
    grades: Grade[];
}

export default function GradeOverview({ grades }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grade Records" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">System-wide Grade Monitoring</h1>
                    <p className="text-sm text-slate-500">Read-only overview of all encoded student grades, period averages, and pass/fail statuses.</p>
                </div>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Student</th>
                                        <th className="p-3">Subject</th>
                                        <th className="p-3">Section</th>
                                        <th className="p-3">Prelim</th>
                                        <th className="p-3">Midterm</th>
                                        <th className="p-3">Final</th>
                                        <th className="p-3">Average</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {grades.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="p-8 text-center text-slate-400">
                                                No grade records encoded yet. Instructors encode grades from their class portal.
                                            </td>
                                        </tr>
                                    ) : (
                                        grades.map((grd) => (
                                            <tr key={grd.id} className="hover:bg-slate-50/50">
                                                <td className="p-3">
                                                    <p className="font-semibold text-slate-900">{grd.student?.name || grd.student_id}</p>
                                                    <p className="text-xs font-mono text-slate-400">{grd.student_id}</p>
                                                </td>
                                                <td className="p-3">
                                                    <p className="font-mono font-medium text-slate-800">{grd.subject_id}</p>
                                                    <p className="text-xs text-slate-500">{grd.subject?.subject_name}</p>
                                                </td>
                                                <td className="p-3 text-slate-600 font-medium">{grd.section_id}</td>
                                                <td className="p-3 font-mono text-slate-800">{grd.prelim !== null ? grd.prelim.toFixed(2) : '—'}</td>
                                                <td className="p-3 font-mono text-slate-800">{grd.midterm !== null ? grd.midterm.toFixed(2) : '—'}</td>
                                                <td className="p-3 font-mono text-slate-800">{grd.final !== null ? grd.final.toFixed(2) : '—'}</td>
                                                <td className="p-3 font-mono font-bold text-slate-900">
                                                    {grd.final_average !== null ? grd.final_average.toFixed(2) : '—'}
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            grd.status === 'Passed'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : grd.status === 'Failed'
                                                                ? 'bg-rose-100 text-rose-700'
                                                                : 'bg-amber-100 text-amber-700'
                                                        }`}
                                                    >
                                                        {grd.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
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
