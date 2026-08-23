import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Users, UserCheck, CheckCircle2, XCircle, Clock, ArrowRight, Trophy, Database, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

interface Stats {
    total_students: number;
    total_instructors: number;
    total_subjects: number;
    total_sections: number;
    total_grades: number;
    passed_students: number;
    failed_students: number;
}

interface AuditLog {
    id: number;
    user_name: string;
    role: string;
    action: string;
    student_id: string;
    subject_id: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    gradeDistribution: Record<string, number>;
    recentAudits: AuditLog[];
}

export default function AdminDashboard({ stats, gradeDistribution, recentAudits }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                {/* Header Welcome */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Academic Overview</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Real-time stats, grade performance distribution, and security audit logs.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/rankings"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#4F6DF5] hover:bg-[#4058D6] rounded-xl shadow-sm transition-all dark:bg-indigo-600 dark:hover:bg-indigo-500"
                        >
                            <Trophy className="w-4 h-4 text-amber-300" />
                            View Rankings
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Students</CardTitle>
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-[#4F6DF5] dark:text-indigo-400">
                                <Users className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total_students.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enrolled student roster</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Instructors</CardTitle>
                            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <UserCheck className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total_instructors.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active faculty members</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Passed Students</CardTitle>
                            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.passed_students.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Final average ≥ 75.00</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Failed Students</CardTitle>
                            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
                                <XCircle className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.failed_students.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Final average &lt; 75.00</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Grade Distribution Visual */}
                    <Card className="lg:col-span-1 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Grade Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                    <span>Excellent (90 - 100)</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{gradeDistribution['Excellent'] || 0}</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${Math.min(100, ((gradeDistribution['Excellent'] || 0) / (stats.total_grades || 1)) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                    <span>Passed (75 - 89)</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{gradeDistribution['Passed'] || 0}</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#4F6DF5] dark:bg-indigo-500 rounded-full"
                                        style={{ width: `${Math.min(100, ((gradeDistribution['Passed'] || 0) / (stats.total_grades || 1)) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                    <span>Failed (&lt; 75)</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{gradeDistribution['Failed'] || 0}</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-rose-500 rounded-full"
                                        style={{ width: `${Math.min(100, ((gradeDistribution['Failed'] || 0) / (stats.total_grades || 1)) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                    <span>Pending Encoding</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{gradeDistribution['Pending'] || 0}</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 rounded-full"
                                        style={{ width: `${Math.min(100, ((gradeDistribution['Pending'] || 0) / (stats.total_grades || 1)) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Grade Audit Activity */}
                    <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Recent Grade Activity</CardTitle>
                            <Link href="/admin/audit-logs" className="text-xs font-medium text-[#4F6DF5] dark:text-indigo-400 hover:underline">
                                View all logs
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentAudits.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-6">No recent grade editing activity logged.</p>
                                ) : (
                                    recentAudits.map((log) => (
                                        <div key={log.id} className="py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                        <span className="font-semibold text-slate-900 dark:text-white">{log.user_name}</span> encoded grade for{' '}
                                                        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">{log.student_id}</span> ({log.subject_id})
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                                    log.action === 'SUBMIT'
                                                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                                        : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300'
                                                }`}
                                            >
                                                {log.action}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
