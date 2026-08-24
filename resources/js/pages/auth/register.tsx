import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { GraduationCap, ShieldCheck } from 'lucide-react';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
            <Head title="Create Account — Secure Grade Administration" />

            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-6">
                {/* Header Logo */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-[#4F6DF5] text-white shadow-md mb-2">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Account</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Register for Administrator or Faculty Access</p>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Prof. Juan Dela Cruz"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1"
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="juan.delacruz@school.edu"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1"
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                                    <div className="mt-1">
                                        <PasswordInput
                                            id="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="••••••••"
                                            passwordrules={passwordRules}
                                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                        />
                                    </div>
                                    <InputError message={errors.password} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</Label>
                                    <div className="mt-1">
                                        <PasswordInput
                                            id="password_confirmation"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="••••••••"
                                            passwordrules={passwordRules}
                                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} className="mt-1" />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold shadow-md py-2.5 rounded-xl transition-all mt-2"
                                    tabIndex={5}
                                    disabled={processing}
                                    data-test="register-user-button"
                                >
                                    {processing && <Spinner className="mr-2" />}
                                    Complete Registration
                                </Button>
                            </div>

                            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                                Already have an account?{' '}
                                <TextLink href={login()} tabIndex={6} className="font-semibold text-[#4F6DF5] dark:text-indigo-400">
                                    Log in
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
