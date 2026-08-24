import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { History, ShieldCheck, ShieldAlert, Key, UserCheck, AlertTriangle } from 'lucide-react';
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

interface AdminAuditLog {
    id: number;
    email: string | null;
    user_name: string | null;
    role: string;
    action: string;
    status: string;
    details: string | null;
    ip_address: string | null;
    created_at: string;
}

interface Props {
    logs: AuditLog[];
    adminLogs?: AdminAuditLog[];
    accessAttemptLogs?: AdminAuditLog[];
}

export default function AuditLogsPage({ logs, adminLogs = [], accessAttemptLogs = [] }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Audit Logs & Security Trails" />

            <div className="p-4 md:p-6 space-y-8 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Audit Logs & Security Trails</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Immutable security logs tracking grade edits, admin operations, and portal access attempts.</p>
                </div>

                {/* Section 1: Grade Editing Audit Trail */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-[#4F6DF5]" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Grade Editing Audit Trail</h2>
                    </div>
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardContent className="p-4 md:p-6 space-y-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-medium text-xs uppercase tracking-wider">
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
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                    No grade audit log activity recorded yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                    <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="p-3">
                                                        <p className="font-semibold text-slate-900 dark:text-white">{log.user_name || log.user_id}</p>
                                                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                            {log.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                                                log.action === 'SUBMIT'
                                                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                                                    : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300'
                                                            }`}
                                                        >
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 font-mono text-slate-800 dark:text-slate-200 font-medium">{log.student_id}</td>
                                                    <td className="p-3 font-mono text-slate-800 dark:text-slate-200">{log.subject_id}</td>
                                                    <td className="p-3 text-slate-500 dark:text-slate-400 font-mono text-xs">
                                                        Avg:{' '}
                                                        {log.old_average !== null ? log.old_average.toFixed(2) : 'N/A'} (P:
                                                        {log.old_prelim ?? '-'} M:{log.old_midterm ?? '-'} F:{log.old_final ?? '-'})
                                                    </td>
                                                    <td className="p-3 text-slate-900 dark:text-white font-mono text-xs font-semibold">
                                                        Avg:{' '}
                                                        {log.new_average !== null ? log.new_average.toFixed(2) : 'N/A'} (P:
                                                        {log.new_prelim ?? '-'} M:{log.new_midterm ?? '-'} F:{log.new_final ?? '-'})
                                                    </td>
                                                    <td className="p-3 font-mono text-slate-400 dark:text-slate-500 text-xs">{log.ip_address || '127.0.0.1'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 2: Admin Operations Audit Trail */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Operations Audit Trail</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Record of administrator account management, subject updates, and portal events.</p>
                        </div>
                    </div>
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardContent className="p-4 md:p-6 space-y-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-medium text-xs uppercase tracking-wider">
                                            <th className="p-3">Timestamp</th>
                                            <th className="p-3">Admin User & Email</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Action</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Details</th>
                                            <th className="p-3 text-right">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {adminLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                    No admin operations recorded yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            adminLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                    <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="p-3">
                                                        <p className="font-semibold text-slate-900 dark:text-white">{log.user_name || 'Admin User'}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{log.email || '—'}</p>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300">
                                                            {log.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 font-mono text-xs font-bold">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-xs text-slate-700 dark:text-slate-300 max-w-xs">
                                                        {log.details || 'No details specified'}
                                                    </td>
                                                    <td className="p-3 text-right font-mono text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">
                                                        {log.ip_address || '127.0.0.1'}
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

                {/* Section 3: Restricted Access Attempts Audit Log */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Restricted Access Attempts Audit Log</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Security log of blocked student login attempts using the Faculty/Admin portal toggle.</p>
                        </div>
                    </div>
                    <Card className="border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 shadow-sm">
                        <CardContent className="p-4 md:p-6 space-y-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-medium text-xs uppercase tracking-wider">
                                            <th className="p-3">Timestamp</th>
                                            <th className="p-3">Student Name & Email</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Attempted Action</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Security Warning / Reason</th>
                                            <th className="p-3 text-right">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {accessAttemptLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                    No restricted portal login attempts recorded yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            accessAttemptLogs.map((log) => (
                                                <tr key={log.id} className="bg-rose-50/30 hover:bg-rose-50/60 dark:bg-rose-950/20 dark:hover:bg-rose-950/40">
                                                    <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="p-3">
                                                        <p className="font-semibold text-slate-900 dark:text-white">{log.user_name || 'Student Account'}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{log.email || '—'}</p>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                                                            {log.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 font-mono text-xs font-bold">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
                                                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm">
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-xs text-rose-800 dark:text-rose-200 font-medium max-w-xs">
                                                        {log.details || 'Student attempted login on Faculty/Admin toggle — Access Denied'}
                                                    </td>
                                                    <td className="p-3 text-right font-mono text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">
                                                        {log.ip_address || '127.0.0.1'}
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
            </div>
        </AppLayout>
    );
}
