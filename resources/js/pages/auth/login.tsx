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
import AppLogoIcon from '@/components/app-logo-icon';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { ShieldCheck, Mail, Lock, GraduationCap } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
            <Head title="Log in — Secure Grade Administration" />

            <PasskeyVerify />

            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-6">
                {/* Header Logo */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-[#4F6DF5] text-white shadow-md mb-2">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">SecureGrade</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Secure Grade Administration & Faculty Management</p>
                </div>

                {status && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        {status}
                    </div>
                )}

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
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
                                            placeholder="admin@school.edu or instructor@school.edu"
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
                                    Log In to Portal
                                </Button>
                            </div>

                            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                                Don't have an account yet?{' '}
                                <TextLink href={register()} tabIndex={5} className="font-semibold text-[#4F6DF5] dark:text-indigo-400">
                                    Create Account
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
