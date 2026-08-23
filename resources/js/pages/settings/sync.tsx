import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { RefreshCw, CloudDownload, CloudUpload, CheckCircle, AlertTriangle, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
    },
    {
        title: 'Data Synchronization',
        href: '/settings/sync',
    },
];

interface SyncLog {
    id: number;
    user_id: string | null;
    direction: string;
    action: string;
    status: string;
    records_count: number;
    details: string | null;
    error_message: string | null;
    created_at: string;
}

interface GoogleStatus {
    connected: boolean;
    spreadsheet_id: string;
    spreadsheet_name: string;
    last_synced_at: string;
    last_status: string;
}

interface Props {
    googleStatus: GoogleStatus;
    syncLogs: SyncLog[];
}

export default function DataSyncPage({ googleStatus, syncLogs }: Props) {
    const { flash } = usePage().props as any;
    const { post, processing } = useForm();

    const handlePull = () => {
        post('/settings/sync/pull');
    };

    const handlePush = () => {
        post('/settings/sync/push');
    };

    const handleBoth = () => {
        post('/settings/sync/both');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Synchronization" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Google Sheets Data Synchronization</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Bi-directional synchronization between local SQLite database and Google Sheets online store.
                    </p>
                </div>

                {flash?.success && (
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        {flash.error}
                    </div>
                )}

                {/* Connection Status Card */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                Google Sheets Connection Status
                            </CardTitle>
                            <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${
                                    googleStatus.connected
                                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${googleStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                {googleStatus.connected ? 'Connected' : 'Offline / Credentials Required'}
                            </span>
                        </div>
                        <CardDescription className="dark:text-slate-400">Server-to-server Google Service Account authentication active.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Spreadsheet Name</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{googleStatus.spreadsheet_name}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Spreadsheet ID</p>
                                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-1 truncate">{googleStatus.spreadsheet_id}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Synchronization</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{googleStatus.last_synced_at}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button
                                onClick={handlePull}
                                disabled={processing}
                                className="bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium shadow-sm flex items-center gap-2"
                            >
                                <CloudDownload className="w-4 h-4" />
                                Pull From Google Sheets
                            </Button>

                            <Button
                                onClick={handlePush}
                                disabled={processing}
                                variant="outline"
                                className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-medium flex items-center gap-2"
                            >
                                <CloudUpload className="w-4 h-4" />
                                Push To Google Sheets
                            </Button>

                            <Button
                                onClick={handleBoth}
                                disabled={processing}
                                variant="secondary"
                                className="bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600 font-medium flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Sync Both Ways
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Sync Log History */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Synchronization History</CardTitle>
                        <CardDescription className="dark:text-slate-400">Recent pull and push synchronization logs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Date & Time</th>
                                        <th className="p-3">Direction</th>
                                        <th className="p-3">Action</th>
                                        <th className="p-3">Records</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {syncLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-6 text-center text-slate-400 dark:text-slate-500">
                                                No synchronization logs recorded yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        syncLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{new Date(log.created_at).toLocaleString()}</td>
                                                <td className="p-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                        {log.direction}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-slate-800 dark:text-slate-200 font-medium">{log.action}</td>
                                                <td className="p-3 font-semibold text-slate-900 dark:text-white">{log.records_count}</td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            log.status === 'Success'
                                                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                                                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                                                        }`}
                                                    >
                                                        {log.status}
                                                    </span>
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
