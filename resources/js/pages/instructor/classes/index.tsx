import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FileSpreadsheet, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Instructor', href: '/instructor/dashboard' },
    { title: 'My Classes', href: '/instructor/classes' },
];

interface Assignment {
    id: number;
    subject_id: string;
    section_id: string;
    school_year: string;
    status: string;
    subject?: { subject_name: string };
}

interface Props {
    classes: Assignment[];
}

export default function MyClasses({ classes }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Classes" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Assigned Classes</h1>
                    <p className="text-sm text-slate-500">Select a class section to view students, enter period grades, and calculate final averages.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.length === 0 ? (
                        <Card className="col-span-full border-slate-200 bg-white p-8 text-center text-slate-400">
                            No class sections currently assigned. Contact the administrator for class assignments.
                        </Card>
                    ) : (
                        classes.map((cls) => (
                            <Card key={cls.id} className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm font-bold text-[#4F6DF5] bg-indigo-50 px-2.5 py-1 rounded">
                                            {cls.subject_id}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                            Section: {cls.section_id}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{cls.subject?.subject_name || 'Subject Course'}</h3>
                                        <p className="text-xs text-slate-400 mt-1">School Year: {cls.school_year}</p>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                            ● {cls.status}
                                        </span>
                                        <Link
                                            href={`/instructor/classes/${cls.id}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#4F6DF5] hover:bg-[#4058D6] px-3 py-1.5 rounded-md transition-colors"
                                        >
                                            <FileSpreadsheet className="w-3.5 h-3.5" />
                                            Encode Grades
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
