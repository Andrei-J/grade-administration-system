import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { History, ShieldCheck, ShieldAlert, AlertTriangle, Search, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useMemo, useCallback } from 'react';

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

function useTableState<T>(data: T[], searchFieldsExtractor: (item: T) => (string | null | undefined)[]) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 8;

    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        const query = search.toLowerCase().trim();
        return data.filter((item) => {
            const fields = searchFieldsExtractor(item);
            return fields.some((field) => field && field.toString().toLowerCase().includes(query));
        });
    }, [data, search, searchFieldsExtractor]);

    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    const safePage = Math.min(Math.max(1, page), totalPages);

    const paginatedData = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, safePage]);

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, []);

    return {
        search,
        setSearch: handleSearchChange,
        page: safePage,
        setPage,
        totalPages,
        totalItems: filteredData.length,
        paginatedData,
        pageSize,
        startItem: filteredData.length === 0 ? 0 : (safePage - 1) * pageSize + 1,
        endItem: Math.min(safePage * pageSize, filteredData.length),
        hasSearch: search.trim().length > 0,
    };
}

function TableFilterInput({ value, onChange, placeholder }: { value: string; onChange: (val: string) => void; placeholder: string }) {
    return (
        <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 text-xs h-9 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
            />
        </div>
    );
}

function PaginationControls({
    page,
    totalPages,
    totalItems,
    startItem,
    endItem,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    totalItems: number;
    startItem: number;
    endItem: number;
    onPageChange: (p: number) => void;
}) {
    if (totalItems === 0) return null;
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <div>
                Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{startItem}</span> to{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{endItem}</span> of{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems}</span> entries
            </div>
            <div className="flex items-center gap-1.5">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="h-7 px-2.5 text-xs border-slate-200 dark:border-slate-700"
                >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                </Button>
                <span className="px-2 font-medium text-slate-600 dark:text-slate-300">
                    Page {page} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="h-7 px-2.5 text-xs border-slate-200 dark:border-slate-700"
                >
                    Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
            </div>
        </div>
    );
}

export default function AuditLogsPage({ logs, adminLogs = [], accessAttemptLogs = [] }: Props) {
    const gradeState = useTableState(
        logs,
        useCallback((log: AuditLog) => [log.user_name, log.user_id, log.role, log.action, log.student_id, log.subject_id, log.ip_address], [])
    );

    const adminState = useTableState(
        adminLogs,
        useCallback((log: AdminAuditLog) => [log.user_name, log.email, log.role, log.action, log.status, log.details, log.ip_address], [])
    );

    const accessAttemptState = useTableState(
        accessAttemptLogs,
        useCallback((log: AdminAuditLog) => [log.user_name, log.email, log.role, log.action, log.status, log.details, log.ip_address], [])
    );

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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <History className="w-5 h-5 text-[#4F6DF5]" />
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Grade Editing Audit Trail</h2>
                        </div>
                        <TableFilterInput
                            value={gradeState.search}
                            onChange={gradeState.setSearch}
                            placeholder="Filter grade audit logs..."
                        />
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
                                        {gradeState.paginatedData.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                    {gradeState.hasSearch ? 'No matching grade audit logs found.' : 'No grade audit log activity recorded yet.'}
                                                </td>
                                            </tr>
                                        ) : (
                                            gradeState.paginatedData.map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                    <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
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

                            <PaginationControls
                                page={gradeState.page}
                                totalPages={gradeState.totalPages}
                                totalItems={gradeState.totalItems}
                                startItem={gradeState.startItem}
                                endItem={gradeState.endItem}
                                onPageChange={gradeState.setPage}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Section 2: Admin Operations Audit Trail */}
                <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Operations Audit Trail</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Record of administrator account management, subject updates, and portal events.</p>
                            </div>
                        </div>
                        <TableFilterInput
                            value={adminState.search}
                            onChange={adminState.setSearch}
                            placeholder="Filter admin audit logs..."
                        />
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
                                        {adminState.paginatedData.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                    {adminState.hasSearch ? 'No matching admin operation logs found.' : 'No admin operations recorded yet.'}
                                                </td>
                                            </tr>
                                        ) : (
                                            adminState.paginatedData.map((log) => {
                                                const isFailed = log.status === 'FAILED' || log.status === 'BLOCKED';
                                                const isLogout = log.action === 'LOGOUT';
                                                const isFailedLogin = log.action === 'FAILED_LOGIN';

                                                return (
                                                    <tr key={log.id} className={isFailed ? "bg-rose-50/30 hover:bg-rose-50/60 dark:bg-rose-950/20 dark:hover:bg-rose-950/40" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"}>
                                                        <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                                                            {new Date(log.created_at).toLocaleString()}
                                                        </td>
                                                        <td className="p-3">
                                                            <p className="font-semibold text-slate-900 dark:text-white">{log.user_name || 'User'}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{log.email || '—'}</p>
                                                        </td>
                                                        <td className="p-3">
                                                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300">
                                                                {log.role}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 font-mono text-xs font-bold">
                                                            <span
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border ${
                                                                    isFailedLogin
                                                                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                                                        : isLogout
                                                                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                                                }`}
                                                            >
                                                                {isLogout ? (
                                                                    <LogOut className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                                ) : isFailedLogin ? (
                                                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                                                ) : (
                                                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                                )}
                                                                {log.action}
                                                            </span>
                                                        </td>
                                                        <td className="p-3">
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                                                                    isFailed
                                                                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                                                                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                                                }`}
                                                            >
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
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <PaginationControls
                                page={adminState.page}
                                totalPages={adminState.totalPages}
                                totalItems={adminState.totalItems}
                                startItem={adminState.startItem}
                                endItem={adminState.endItem}
                                onPageChange={adminState.setPage}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Section 3: Restricted Access & Portal Toggle Attempts Audit Log */}
                <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Restricted Access Attempts Audit Log</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Security log of portal login attempts and portal toggle events (students, professors, instructors).</p>
                            </div>
                        </div>
                        <TableFilterInput
                            value={accessAttemptState.search}
                            onChange={accessAttemptState.setSearch}
                            placeholder="Filter restricted access logs..."
                        />
                    </div>
                    <Card className="border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 shadow-sm">
                        <CardContent className="p-4 md:p-6 space-y-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-medium text-xs uppercase tracking-wider">
                                            <th className="p-3">Timestamp</th>
                                            <th className="p-3">User Name &amp; Email</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Attempted Action</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Security Warning / Reason</th>
                                            <th className="p-3 text-right">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {accessAttemptState.paginatedData.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                    {accessAttemptState.hasSearch ? 'No matching restricted access logs found.' : 'No restricted portal login attempts recorded yet.'}
                                                </td>
                                            </tr>
                                        ) : (
                                            accessAttemptState.paginatedData.map((log) => {
                                                const isBlocked = log.status === 'BLOCKED';
                                                const roleLower = (log.role || '').toLowerCase();
                                                const isFaculty = roleLower.includes('professor') || roleLower.includes('instructor') || roleLower.includes('faculty');

                                                return (
                                                    <tr key={log.id} className={isBlocked ? "bg-rose-50/30 hover:bg-rose-50/60 dark:bg-rose-950/20 dark:hover:bg-rose-950/40" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"}>
                                                        <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                                                            {new Date(log.created_at).toLocaleString()}
                                                        </td>
                                                        <td className="p-3">
                                                            <p className="font-semibold text-slate-900 dark:text-white">{log.user_name || (isFaculty ? 'Faculty Account' : 'Student Account')}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{log.email || '—'}</p>
                                                        </td>
                                                        <td className="p-3">
                                                            <span
                                                                className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                                    isFaculty
                                                                        ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300'
                                                                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                                                                }`}
                                                            >
                                                                {log.role}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 font-mono text-xs font-bold">
                                                            <span
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border ${
                                                                    isBlocked
                                                                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800'
                                                                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                                                                }`}
                                                            >
                                                                <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${isBlocked ? 'text-rose-600' : 'text-amber-600'}`} />
                                                                {log.action}
                                                            </span>
                                                        </td>
                                                        <td className="p-3">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                                    isBlocked
                                                                        ? 'bg-rose-600 text-white shadow-sm'
                                                                        : 'bg-emerald-600 text-white shadow-sm'
                                                                }`}
                                                            >
                                                                {log.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-xs text-slate-700 dark:text-slate-300 font-medium max-w-xs">
                                                            {log.details || (isBlocked ? 'Attempted login on restricted portal — Access Denied' : 'Portal access event recorded')}
                                                        </td>
                                                        <td className="p-3 text-right font-mono text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">
                                                            {log.ip_address || '127.0.0.1'}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <PaginationControls
                                page={accessAttemptState.page}
                                totalPages={accessAttemptState.totalPages}
                                totalItems={accessAttemptState.totalItems}
                                startItem={accessAttemptState.startItem}
                                endItem={accessAttemptState.endItem}
                                onPageChange={accessAttemptState.setPage}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
