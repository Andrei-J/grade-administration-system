import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FileSpreadsheet, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Student Dashboard', href: '/student/dashboard' },
    { title: 'My Grades', href: '/student/grades' },
];

interface StudentInfo {
    name: string;
    student_id: string;
    grade_level: string;
    section: string;
    program?: string;
    semester?: string;
    school_year: string;
}

interface GradeItem {
    id: number;
    subject_code: string;
    subject_name: string;
    instructor_name: string;
    prelim: string;
    midterm: string;
    final: string;
    average: string;
    status: string;
}

interface Props {
    studentInfo: StudentInfo;
    grades: GradeItem[];
}

export default function StudentGradesIndex({ studentInfo, grades }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Grades" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 border border-blue-200/50 dark:border-blue-800">
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            Official Grade Report
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            My Grades
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {studentInfo.name} • <span className="font-semibold text-indigo-600 dark:text-indigo-400">{studentInfo.program || 'BSAIT'}</span> • <span>{studentInfo.semester || '1st Semester'}</span> • {studentInfo.grade_level} ({studentInfo.section}) • SY {studentInfo.school_year}
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                        <Lock className="w-4 h-4 text-emerald-500" />
                        Read-Only Verified Record
                    </div>
                </div>

                {/* Grades Table */}
                <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                            Enrolled Subject Grades
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3.5">Subject</th>
                                    <th className="px-6 py-3.5">Instructor</th>
                                    <th className="px-4 py-3.5 text-center">Prelim</th>
                                    <th className="px-4 py-3.5 text-center">Midterm</th>
                                    <th className="px-4 py-3.5 text-center">Final</th>
                                    <th className="px-4 py-3.5 text-center">Average</th>
                                    <th className="px-6 py-3.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {grades.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                            No grade records found.
                                        </td>
                                    </tr>
                                ) : (
                                    grades.map((g) => (
                                        <tr key={g.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                                                <div>{g.subject_name}</div>
                                                <div className="text-xs font-normal text-slate-500 dark:text-slate-400">{g.subject_code}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                {g.instructor_name}
                                            </td>
                                            <td className="px-4 py-4 text-center font-mono text-slate-700 dark:text-slate-300">
                                                {g.prelim}
                                            </td>
                                            <td className="px-4 py-4 text-center font-mono text-slate-700 dark:text-slate-300">
                                                {g.midterm}
                                            </td>
                                            <td className="px-4 py-4 text-center font-mono text-slate-700 dark:text-slate-300">
                                                {g.final}
                                            </td>
                                            <td className="px-4 py-4 text-center font-mono font-extrabold text-slate-900 dark:text-white">
                                                {g.average}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                        g.status === 'Passed'
                                                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                                            : g.status === 'Failed'
                                                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                    }`}
                                                >
                                                    {g.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
