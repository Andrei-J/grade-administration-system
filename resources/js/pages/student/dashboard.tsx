import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { BookOpen, Award, CheckCircle2, XCircle, ArrowRight, FileSpreadsheet, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Student Dashboard', href: '/student/dashboard' },
];

interface StudentInfo {
    name: string;
    student_id: string;
    grade_level: string;
    section: string;
    program?: string;
    semester?: string;
    school_year: string;
    email: string;
}

interface Summary {
    subjects_count: number;
    current_average: number;
    passed_count: number;
    failed_count: number;
}

interface RecentGrade {
    id: number;
    subject_code: string;
    subject_name: string;
    instructor_name: string;
    prelim: number | null;
    midterm: number | null;
    final: number | null;
    final_average: number | null;
    status: string;
}

interface Props {
    studentInfo: StudentInfo;
    summary: Summary;
    recentGrades: RecentGrade[];
}

export default function StudentDashboard({ studentInfo, summary, recentGrades }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                {/* Welcome Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-blue-100 mb-2 border border-white/20">
                            <span className="font-semibold">{studentInfo.program || 'BSAIT'}</span>
                            <span>•</span>
                            <span>{studentInfo.semester || '1st Semester'}</span>
                            <span>•</span>
                            <span>{studentInfo.grade_level}</span>
                            <span>•</span>
                            <span>{studentInfo.section}</span>
                            <span>•</span>
                            <span>SY {studentInfo.school_year}</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Welcome, {studentInfo.name}!
                        </h1>
                        <p className="text-sm text-blue-100 mt-1 max-w-xl">
                            Track your academic progress, view subject grades, and check your ranking performance for this school year.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/student/grades"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 font-semibold text-sm rounded-xl shadow-sm hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            View Full Grades
                        </Link>
                        <Link
                            href="/student/ranking"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500/30 backdrop-blur-md text-white font-semibold text-sm rounded-xl border border-white/20 hover:bg-blue-500/40 transition-all"
                        >
                            <Trophy className="w-4 h-4 text-amber-300" />
                            My Ranking
                        </Link>
                    </div>
                </div>

                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Enrolled Subjects
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                <BookOpen className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {summary.subjects_count}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Total subjects this term
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Current Average
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                                <Award className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                {summary.current_average.toFixed(2)}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Overall GWA calculation
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Passed Subjects
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {summary.passed_count}
                            </div>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                                Final grade &ge; 75.00
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Failed / Pending
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                                <XCircle className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {summary.failed_count}
                            </div>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                                Needs academic attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Grades Overview */}
                <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                Recent Academic Grades
                            </CardTitle>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Performance breakdown across your assigned subjects
                            </p>
                        </div>
                        <Link
                            href="/student/grades"
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                        >
                            View All Grades <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
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
                                    <th className="px-4 py-3.5 text-center">Final Average</th>
                                    <th className="px-6 py-3.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentGrades.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                            No grade records available yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentGrades.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                                                <div>{item.subject_name}</div>
                                                <div className="text-xs font-normal text-slate-500 dark:text-slate-400">{item.subject_code}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                {item.instructor_name}
                                            </td>
                                            <td className="px-4 py-4 text-center font-mono text-slate-700 dark:text-slate-300">
                                                {item.prelim !== null ? Number(item.prelim).toFixed(2) : '-'}
                                            </td>
                                            <td className="px-4 py-4 text-center font-mono text-slate-700 dark:text-slate-300">
                                                {item.midterm !== null ? Number(item.midterm).toFixed(2) : '-'}
                                            </td>
                                            <td className="px-4 py-4 text-center font-mono text-slate-700 dark:text-slate-300">
                                                {item.final !== null ? Number(item.final).toFixed(2) : '-'}
                                            </td>
                                            <td className="px-4 py-4 text-center font-mono font-bold text-slate-900 dark:text-white">
                                                {item.final_average !== null ? Number(item.final_average).toFixed(2) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        item.status === 'Passed'
                                                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                                            : item.status === 'Failed'
                                                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                    }`}
                                                >
                                                    {item.status}
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
