import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Student Rankings', href: '/admin/rankings' },
];

interface RankingRow {
    rank: number;
    student_id: string;
    student_name: string;
    grade_level: string;
    section: string;
    school_year: string;
    subjects_count: number;
    average: number;
    status: string;
    is_tie: boolean;
}

interface Section {
    section_name: string;
    grade_level: string;
}

interface Props {
    sectionRankings: RankingRow[];
    gradeLevelRankings: RankingRow[];
    overallRankings: RankingRow[];
    sections: Section[];
    filters: {
        school_year: string;
        section?: string;
        grade_level?: string;
    };
}

export default function RankingsPage({ sectionRankings, gradeLevelRankings, overallRankings, sections, filters }: Props) {
    const [activeTab, setActiveTab] = useState<'section' | 'grade' | 'overall'>('section');

    const activeRankings =
        activeTab === 'section' ? sectionRankings : activeTab === 'grade' ? gradeLevelRankings : overallRankings;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Rankings" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Academic Rankings</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Dynamic student honors based on overall Final Average across sections, grade levels, and school-wide performance.
                        </p>
                    </div>

                    {/* Tab Selection */}
                    <div className="inline-flex p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl">
                        <button
                            onClick={() => setActiveTab('section')}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                activeTab === 'section'
                                    ? 'bg-white dark:bg-slate-900 text-[#4F6DF5] dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Section Ranking
                        </button>
                        <button
                            onClick={() => setActiveTab('grade')}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                activeTab === 'grade'
                                    ? 'bg-white dark:bg-slate-900 text-[#4F6DF5] dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Grade Level Ranking
                        </button>
                        <button
                            onClick={() => setActiveTab('overall')}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                activeTab === 'overall'
                                    ? 'bg-white dark:bg-slate-900 text-[#4F6DF5] dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            School-Wide Overall
                        </button>
                    </div>
                </div>

                {/* Ranking Data Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            {activeTab === 'section' && 'Section Rankings'}
                            {activeTab === 'grade' && 'Grade Level Honor Roll'}
                            {activeTab === 'overall' && 'Overall School-Wide Top Performers'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3 w-16 text-center">Rank</th>
                                        <th className="p-3">Student Name</th>
                                        <th className="p-3">Grade Level</th>
                                        <th className="p-3">Section</th>
                                        <th className="p-3 text-center">Subjects</th>
                                        <th className="p-3 text-right">Final Average</th>
                                        <th className="p-3 text-center">Tie Indicator</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {activeRankings.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                No calculated rankings available for the selected view.
                                            </td>
                                        </tr>
                                    ) : (
                                        activeRankings.map((row, idx) => (
                                            <tr
                                                key={idx}
                                                className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 ${
                                                    row.rank === 1 ? 'bg-amber-50/30 dark:bg-amber-950/20 font-semibold' : ''
                                                }`}
                                            >
                                                <td className="p-3 text-center">
                                                    {row.rank === 1 ? (
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs">
                                                            1st
                                                        </span>
                                                    ) : row.rank === 2 ? (
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                                                            2nd
                                                        </span>
                                                    ) : row.rank === 3 ? (
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-900/10 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 font-bold text-xs">
                                                            3rd
                                                        </span>
                                                    ) : (
                                                        <span className="font-mono text-slate-600 dark:text-slate-400">{row.rank}</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <p className="font-semibold text-slate-900 dark:text-white">{row.student_name}</p>
                                                    <p className="text-xs font-mono text-slate-400 dark:text-slate-500">{row.student_id}</p>
                                                </td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{row.grade_level}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{row.section}</td>
                                                <td className="p-3 text-center font-mono text-slate-700 dark:text-slate-300">{row.subjects_count}</td>
                                                <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white text-base">
                                                    {row.average.toFixed(2)}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {row.is_tie ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                                            Tie ({row.average.toFixed(2)})
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                                                    )}
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
