import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Trophy, Award, Layers, Users, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Student Dashboard', href: '/student/dashboard' },
    { title: 'My Ranking', href: '/student/ranking' },
];

interface StudentInfo {
    name: string;
    student_id: string;
    grade_level: string;
    section: string;
    school_year: string;
    gpa: number;
}

interface RankingInfo {
    section_rank: number | string;
    section_total: number;
    grade_level_rank: number | string;
    grade_level_total: number;
    overall_rank: number | string;
    overall_total: number;
}

interface Props {
    studentInfo: StudentInfo;
    ranking: RankingInfo;
}

export default function StudentRankingIndex({ studentInfo, ranking }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Ranking" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                {/* Banner */}
                <div className="p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-amber-100 mb-2 border border-white/30">
                            <Trophy className="w-3.5 h-3.5 text-amber-200" />
                            Academic Standing
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            My Ranking Performance
                        </h1>
                        <p className="text-sm text-amber-100 mt-1">
                            {studentInfo.name} • {studentInfo.section} ({studentInfo.grade_level}) • Overall GWA: <span className="font-bold text-white">{studentInfo.gpa.toFixed(2)}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs font-medium text-amber-100">
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        Privacy Protected Rank Overview
                    </div>
                </div>

                {/* 3 Ranking Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Section Rank */}
                    <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Section Rank
                            </CardTitle>
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                                <Trophy className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {typeof ranking.section_rank === 'number' ? `#${ranking.section_rank}` : 'N/A'}
                            </div>
                            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-1">
                                of {ranking.section_total} students
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 border-t border-slate-100 dark:border-slate-800 pt-2">
                                Class rank within section <span className="font-semibold text-slate-700 dark:text-slate-300">{studentInfo.section}</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Grade Level Rank */}
                    <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Grade Level Rank
                            </CardTitle>
                            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                <Layers className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {typeof ranking.grade_level_rank === 'number' ? `#${ranking.grade_level_rank}` : 'N/A'}
                            </div>
                            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                                of {ranking.grade_level_total} students
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 border-t border-slate-100 dark:border-slate-800 pt-2">
                                Standing across <span className="font-semibold text-slate-700 dark:text-slate-300">{studentInfo.grade_level}</span> batch
                            </p>
                        </CardContent>
                    </Card>

                    {/* Overall Rank */}
                    <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Overall Rank
                            </CardTitle>
                            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                                <Users className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {typeof ranking.overall_rank === 'number' ? `#${ranking.overall_rank}` : 'N/A'}
                            </div>
                            <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                                of {ranking.overall_total} students
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 border-t border-slate-100 dark:border-slate-800 pt-2">
                                School-wide academic standing
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
