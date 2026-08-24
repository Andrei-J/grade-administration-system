import { Form, Head, router, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { CheckCircle2, ChevronDown, ChevronUp, Database, Loader2, RefreshCw, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

interface GoogleSheetsProps {
    spreadsheetId: string;
    credentialsJson: string | null;
    credentialsExist: boolean;
    isConnected: boolean;
    isAdmin: boolean;
}

interface TestResult {
    connected: boolean;
    message: string;
    spreadsheet_id?: string;
    title?: string;
    sheets?: string[];
}

export default function Profile({
    mustVerifyEmail,
    status,
    googleSheets,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    googleSheets: GoogleSheetsProps;
}) {
    const { auth } = usePage<PageProps>().props;

    // Google Sheets config state
    const [spreadsheetId, setSpreadsheetId] = useState(googleSheets?.spreadsheetId ?? '');
    const [credentialsJson, setCredentialsJson] = useState(googleSheets?.credentialsJson ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);
    const [testResult, setTestResult] = useState<TestResult | null>(null);
    const [isConnected, setIsConnected] = useState(googleSheets?.isConnected ?? false);
    const [jsonExpanded, setJsonExpanded] = useState(!googleSheets?.credentialsExist);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Laravel uses an XSRF-TOKEN cookie for SPA CSRF protection
    const getCsrfToken = () => {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    };

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveResult(null);
        setTestResult(null);

        try {
            const res = await fetch('/settings/profile/google-sheets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    spreadsheet_id: spreadsheetId,
                    credentials_json: credentialsJson,
                }),
            });
            const data = await res.json();
            setSaveResult(data);
            if (data.success) {
                // Auto-dismiss after 4 seconds
                saveTimerRef.current = setTimeout(() => setSaveResult(null), 4000);
                // Refresh connection status
                handleTestConnection(true);
            }
        } catch {
            setSaveResult({ success: false, message: 'Network error. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleTestConnection = async (silent = false) => {
        if (!silent) {
            setIsTesting(true);
            setTestResult(null);
        }

        try {
            const res = await fetch('/settings/profile/google-sheets/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
            });
            const data: TestResult = await res.json();
            if (!silent) setTestResult(data);
            setIsConnected(data.connected);
        } catch {
            if (!silent) setTestResult({ connected: false, message: 'Network error during connection test.' });
        } finally {
            if (!silent) setIsTesting(false);
        }
    };

    const placeholderJson = `{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
  "client_email": "your-service@your-project.iam.gserviceaccount.com",
  ...
}`;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to re-send the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been
                                                sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {/* ── Google Sheets Configuration (admin only) ───────────────── */}
            {googleSheets?.isAdmin && (
                <>
                    <Separator />

                    <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                            <h2 className="text-base font-semibold leading-none text-slate-900 dark:text-slate-100">
                                Google Sheets Integration
                            </h2>
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Connect your Google Spreadsheet to enable real-time dual-database sync alongside SQLite.
                        </p>
                    </div>

                    {/* Connection badge */}
                    <span
                        className={`mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                            isConnected
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-400'}`}
                        />
                        {isConnected ? 'Connected' : 'Not Connected'}
                    </span>
                </div>

                {/* Spreadsheet ID */}
                <div className="grid gap-2">
                    <Label htmlFor="gs-spreadsheet-id">
                        Spreadsheet ID
                        <span className="ml-1 text-xs font-normal text-muted-foreground">(from the Google Sheets URL)</span>
                    </Label>
                    <Input
                        id="gs-spreadsheet-id"
                        value={spreadsheetId}
                        onChange={(e) => setSpreadsheetId(e.target.value)}
                        placeholder="e.g. 1i-y0UrR_4UnsxtpyLyY1InjTjUTTLmhW8OdUdTjFqfA"
                        className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                        Found in your spreadsheet URL:{' '}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                            docs.google.com/spreadsheets/d/<strong>[SPREADSHEET_ID]</strong>/edit
                        </code>
                    </p>
                </div>

                {/* Service Account JSON */}
                <div className="grid gap-2">
                    <button
                        type="button"
                        onClick={() => setJsonExpanded((v) => !v)}
                        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                Service Account JSON
                            </span>
                            {googleSheets?.credentialsExist && !jsonExpanded && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Saved
                                </span>
                            )}
                        </div>
                        {jsonExpanded ? (
                            <ChevronUp className="h-4 w-4 text-slate-500" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                        )}
                    </button>

                    {jsonExpanded && (
                        <div className="mt-1 grid gap-2">
                            <p className="text-xs text-muted-foreground">
                                Paste your Google Service Account JSON key file contents below. You can download it from the{' '}
                                <a
                                    href="https://console.cloud.google.com/iam-admin/serviceaccounts"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400"
                                >
                                    Google Cloud Console
                                </a>
                                .
                            </p>
                            <textarea
                                id="gs-credentials-json"
                                value={credentialsJson}
                                onChange={(e) => setCredentialsJson(e.target.value)}
                                placeholder={placeholderJson}
                                rows={14}
                                spellCheck={false}
                                className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed text-slate-800 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-0 dark:text-slate-200 dark:placeholder:text-slate-600"
                            />
                        </div>
                    )}
                </div>

                {/* Result banners */}
                {saveResult && (
                    <div
                        className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                            saveResult.success
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                    >
                        {saveResult.success ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                        )}
                        {saveResult.message}
                    </div>
                )}

                {testResult && (
                    <div
                        className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                            testResult.connected
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                    >
                        {testResult.connected ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                        )}
                        <div>
                            {testResult.message}
                            {testResult.connected && testResult.sheets && testResult.sheets.length > 0 && (
                                <p className="mt-1.5 font-mono text-xs opacity-75">
                                    Tabs: {testResult.sheets.join(' · ')}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !spreadsheetId.trim() || !credentialsJson.trim()}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving…
                            </>
                        ) : (
                            'Save Configuration'
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleTestConnection(false)}
                        disabled={isTesting}
                        className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950"
                    >
                        {isTesting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Testing…
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Test Connection
                            </>
                        )}
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                    Credentials are stored securely at{' '}
                    <code className="rounded bg-muted px-1 py-0.5">storage/app/google/service-account.json</code>.
                    The Spreadsheet ID is written to your <code className="rounded bg-muted px-1 py-0.5">.env</code> file.
                </p>
                    </div>
                </>
            )}

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
