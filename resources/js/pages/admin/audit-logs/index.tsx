import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { History, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Audit Trail', href: '/admin/audit-logs' },
];

interface AuditLog {
    id: number;
    user_id: string;
    user_name: string;
    role: string;
    action: string;
    student_id: string;
    subject_id: string;
    old_prelim: number | null;
    new_prelim: number | null;
    old_midterm: number | null;
    new_midterm: number | null;
    old_final: number | null;
    new_final: number | null;
    old_average: number | null;
    new_average: number | null;
    ip_address: string | null;
    created_at: string;
}

interface Props {
    logs: AuditLog[];
}

export default function AuditLogsPage({ logs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grade Editing Audit Logs" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Grade Editing Audit Trail</h1>
                    <p className="text-sm text-slate-500">Immutable, append-only security logs of all grade modifications and submissions.</p>
                </div>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Timestamp</th>
                                        <th className="p-3">User & Role</th>
                                        <th className="p-3">Action</th>
                                        <th className="p-3">Student ID</th>
                                        <th className="p-3">Subject</th>
                                        <th className="p-3">Previous Grade</th>
                                        <th className="p-3">New Grade</th>
                                        <th className="p-3">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="p-8 text-center text-slate-400">
                                                No audit log activity recorded yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50/50">
                                                <td className="p-3 text-slate-600 font-mono text-xs">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td className="p-3">
                                                    <p className="font-semibold text-slate-900">{log.user_name || log.user_id}</p>
                                                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                                                        {log.role}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                                            log.action === 'SUBMIT'
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : 'bg-indigo-100 text-indigo-800'
                                                        }`}
                                                    >
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-mono text-slate-800 font-medium">{log.student_id}</td>
                                                <td className="p-3 font-mono text-slate-800">{log.subject_id}</td>
                                                <td className="p-3 text-slate-500 font-mono text-xs">
                                                    Avg:{' '}
                                                    {log.old_average !== null ? log.old_average.toFixed(2) : 'N/A'} (P:
                                                    {log.old_prelim ?? '-'} M:{log.old_midterm ?? '-'} F:{log.old_final ?? '-'})
                                                </td>
                                                <td className="p-3 text-slate-900 font-mono text-xs font-semibold">
                                                    Avg:{' '}
                                                    {log.new_average !== null ? log.new_average.toFixed(2) : 'N/A'} (P:
                                                    {log.new_prelim ?? '-'} M:{log.new_midterm ?? '-'} F:{log.new_final ?? '-'})
                                                </td>
                                                <td className="p-3 font-mono text-slate-400 text-xs">{log.ip_address || '127.0.0.1'}</td>
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
