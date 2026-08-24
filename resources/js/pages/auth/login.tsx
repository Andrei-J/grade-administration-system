import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { ShieldCheck, Mail, Lock, GraduationCap, AlertTriangle, Star, TrendingUp, Award } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [selectedRole, setSelectedRole] = useState<'student' | 'faculty'>('student');

    return (
        <div className="min-h-screen flex">
            <Head title="Log in — Secure Grade Administration" />

            <PasskeyVerify />

            {/* ── Left Panel ── */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#4F6DF5] relative overflow-hidden p-10">
                    {/* Background decorative circles */}
                    <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
                    <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full" />
                    <div className="absolute bottom-32 right-0 w-32 h-32 bg-white/10 rounded-full" />

                    {/* Logo & Title */}
                    <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-white/20 text-white shadow-md backdrop-blur-sm">
                            <GraduationCap className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-white tracking-tight">SecureGrade</h1>
                            <p className="text-blue-100 text-sm mt-1">Secure Grade Administration &amp; Faculty Management</p>
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="relative z-10 flex-1 flex items-center justify-center py-6">
                        <img
                            src="/images/login-illustration.jpg"
                            alt="Student studying illustration"
                            className="w-full max-w-[280px] object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* Stats badges */}
                    <div className="relative z-10 space-y-2.5">
                        <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
                            <TrendingUp className="w-4 h-4 text-blue-100 shrink-0" />
                            <p className="text-white text-xs font-medium">Track academic performance in real-time</p>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
                            <Award className="w-4 h-4 text-blue-100 shrink-0" />
                            <p className="text-white text-xs font-medium">View class rankings &amp; grade reports</p>
                        </div>
                    </div>
            </div>

            {/* ── Right Panel (Form) ── */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12 space-y-6 bg-white dark:bg-slate-900 overflow-y-auto">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center space-y-1">
                        <div className="inline-flex items-center justify-center size-11 rounded-2xl bg-[#4F6DF5] text-white shadow-md mb-1">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">SecureGrade</h1>
                    </div>

                    {/* Heading */}
                    <div className="space-y-1">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back!</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to your portal to continue.</p>
                    </div>

                    {status && (
                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-medium text-emerald-700 dark:text-emerald-300">
                            {status}
                        </div>
                    )}

                    {/* Role Switcher Tabs */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Select Portal Role
                        </Label>
                        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setSelectedRole('student')}
                                className={`py-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
                                    selectedRole === 'student'
                                        ? 'bg-white dark:bg-slate-900 text-[#4F6DF5] dark:text-indigo-400 shadow-sm font-bold'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <GraduationCap className="w-4 h-4" />
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole('faculty')}
                                className={`py-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
                                    selectedRole === 'faculty'
                                        ? 'bg-white dark:bg-slate-900 text-[#4F6DF5] dark:text-indigo-400 shadow-sm font-bold'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Faculty
                            </button>
                        </div>
                    </div>

                    {selectedRole === 'faculty' ? (
                        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2.5 font-medium shadow-sm">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>Faculty log in only! Student accounts are restricted from accessing this portal.</span>
                        </div>
                    ) : (
                        <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 rounded-xl text-indigo-800 dark:text-indigo-200 text-xs flex items-center gap-2.5 font-medium shadow-sm">
                            <AlertTriangle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span>Student log in only! Faculty and Admin accounts are restricted from accessing this portal.</span>
                        </div>
                    )}

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <input type="hidden" name="portal" value={selectedRole} />

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Email Address
                                        </Label>
                                        <div className="relative mt-1">
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder={
                                                    selectedRole === 'student'
                                                        ? 'student@school.edu'
                                                        : 'faculty@example.com'
                                                }
                                                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs text-[#4F6DF5] dark:text-indigo-400 hover:underline font-medium"
                                                    tabIndex={5}
                                                >
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <div className="mt-1">
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-2 pt-1">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 font-normal">
                                            Keep me logged in
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold shadow-md py-2.5 rounded-xl transition-all"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner className="mr-2" />}
                                        Log In to {selectedRole === 'student' ? 'Student' : 'Faculty'} Portal
                                    </Button>
                                </div>

                                {/* Create Account link is strictly shown only when Student role is selected */}
                                {selectedRole === 'student' && (
                                    <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        Don't have an account yet?{' '}
                                        <TextLink href="/student-registration" tabIndex={5} className="font-semibold text-[#4F6DF5] dark:text-indigo-400">
                                            Create Account
                                        </TextLink>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>
            </div>
        </div>
    );
}
