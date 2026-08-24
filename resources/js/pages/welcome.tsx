import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import {
    GraduationCap,
    ShieldCheck,
    RefreshCw,
    Trophy,
    BookOpen,
    Users,
    ArrowRight,
    CheckCircle2,
    Lock,
    Sparkles,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome() {
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
            <Head title="SecureGrade — Grade Administration System" />

            {/* Navigation Bar */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-[#4F6DF5] text-white shadow-md">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">SecureGrade</span>
                            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-[#4F6DF5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                Academic SaaS
                            </span>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-sm transition-all"
                            >
                                Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                Log In
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
                        Secure Grade Administration & Dynamic Academic Honors
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
                        Streamline student records, automated period grade encoding, instant Final Average computations, role-based security, and bi-directional Google Sheets sync.
                    </p>

   

                    {/* App Visual Preview Mockup (Acadex Style) */}
                    <div className="mt-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xl max-w-5xl mx-auto text-left space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                </div>
                                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">https://securegrade.app/admin/dashboard</span>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                                ● System Live & Synced
                            </span>
                        </div>

                        {/* Interactive Preview Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Enrolled</span>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1,284 Students</p>
                                <span className="text-xs text-emerald-600 font-medium">↑ 8.2% this semester</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pass Rate</span>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">94.8% Passed</p>
                                <span className="text-xs text-slate-500">Final Average ≥ 75.00</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Google Sheets Sync</span>
                                <p className="text-2xl font-bold text-[#4F6DF5] dark:text-indigo-400 mt-1">Bi-Directional</p>
                                <span className="text-xs text-slate-500">Local DB + Remote Sheet</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Showcase */}
            <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Built for Security & Academic Precision</h2>
                        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">Everything administrators and faculty need to encode, audit, and rank student performance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-[#4F6DF5] dark:text-indigo-400 w-fit rounded-xl">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role-Based Security</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Strict server-side policy enforcement prevents instructors from accessing or modifying unauthorized classes (IDOR Protection).</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 w-fit rounded-xl">
                                <RefreshCw className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Google Sheets Sync</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Pull, push, and bi-directionally synchronize online spreadsheet data with fast local SQLite storage.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 w-fit rounded-xl">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dynamic Honors Ranking</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Automatic Section, Grade Level, and School-Wide ranking calculations with dense tie indicators.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    SecureGrade Administration System &copy; {new Date().getFullYear()}. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
