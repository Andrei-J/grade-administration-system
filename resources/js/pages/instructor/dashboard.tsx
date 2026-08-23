import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FileSpreadsheet, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Instructor Dashboard', href: '/instructor/dashboard' },
];

interface Assignment {
    id: number;
    subject_id: string;
    section_id: string;
    school_year: string;
    subject?: { subject_name: string };
}

interface Props {
    instructorName: string;
    assignedClasses: Assignment[];
    stats: {
        assigned_classes_count: number;
        pending_entries: number;
        total_graded: number;
    };
    recentUpdates: any[];
}

export default function InstructorDashboard({ instructorName, assignedClasses, stats, recentUpdates }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Instructor Dashboard" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                {/* Welcome Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#4F6DF5] to-[#4058D6] text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, {instructorName}!</h1>
                        <p className="text-sm text-indigo-100 mt-1">Select an assigned class below to manage student grades and compute final averages.</p>
                    </div>
                    <Link
                        href="/instructor/classes"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#4F6DF5] font-semibold text-sm rounded-lg shadow hover:bg-indigo-50 transition-colors self-start md:self-auto"
                    >
                        View My Classes
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-slate-200 bg-white shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Classes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stats.assigned_classes_count}</div>
                            <p className="text-xs text-slate-500 mt-1">Active class sections</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Entries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">{stats.pending_entries}</div>
                            <p className="text-xs text-slate-500 mt-1">Grades awaiting completion</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Graded</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">{stats.total_graded}</div>
                            <p className="text-xs text-slate-500 mt-1">Calculated student records</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Assigned Classes Grid */}
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Assigned Classes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignedClasses.length === 0 ? (
                            <Card className="col-span-full border-slate-200 bg-white p-8 text-center text-slate-400">
                                No classes currently assigned to your account.
                            </Card>
                        ) : (
                            assignedClasses.map((cls) => (
                                <Card key={cls.id} className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-sm font-bold text-[#4F6DF5] bg-indigo-50 px-2.5 py-1 rounded">
                                                {cls.subject_id}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                {cls.section_id}
                                            </span>
                                        </div>
                                        <CardTitle className="text-base font-semibold text-slate-900 mt-2">
                                            {cls.subject?.subject_name || 'Subject Course'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-2 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">{cls.school_year}</span>
                                        <Link
                                            href={`/instructor/classes/${cls.id}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#4F6DF5] hover:bg-[#4058D6] px-3 py-1.5 rounded-md transition-colors"
                                        >
                                            <FileSpreadsheet className="w-3.5 h-3.5" />
                                            Open Class
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
