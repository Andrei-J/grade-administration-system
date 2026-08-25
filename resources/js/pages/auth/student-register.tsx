import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { GraduationCap, Mail, BookOpen, CheckCircle2, TrendingUp, Award } from 'lucide-react';

interface Section {
    id: number;
    section_name: string;
    grade_level: string;
}

interface Props {
    sections?: Section[];
    programs?: string[];
    semesters?: string[];
}

export default function StudentRegister({
    sections = [],
    programs = [],
    semesters = ['1st Semester', '2nd Semester', 'Summer'],
}: Props) {
    const defaultSection = sections.length > 0 ? sections[0].section_name : 'BSIT-1A';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        student_id: '',
        program: programs[0] || 'BSAIT',
        semester: semesters[0] || '1st Semester',
        grade_level: '1st Year',
        section: defaultSection,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/student-registration');
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Student Registration — Secure Grade Administration" />

            {/* ── Left Panel ── */}
            <div className="hidden lg:flex flex-col justify-between w-[38%] bg-[#4F6DF5] relative overflow-hidden p-10">
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
                            <p className="text-blue-100 text-sm mt-1">Create your student account to access grades and academic rankings.</p>
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="relative z-10 flex-1 flex items-center justify-center py-6">
                        <img
                            src="/images/login-illustration.jpg"
                            alt="Student studying illustration"
                            className="w-full max-w-[240px] object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* Feature list */}
                    <div className="relative z-10 space-y-2.5">
                        {[
                            { icon: TrendingUp, text: 'Track academic performance in real-time' },
                            { icon: Award, text: 'View class rankings & grade reports' },
                            { icon: CheckCircle2, text: 'Monitor enrollment & section details' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
                                <Icon className="w-4 h-4 text-blue-100 shrink-0" />
                                <p className="text-white text-xs font-medium">{text}</p>
                            </div>
                        ))}
                    </div>
            </div>

            {/* ── Right Panel (Form) ── */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-10 overflow-y-auto bg-white dark:bg-slate-900">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center space-y-1 mb-4">
                        <div className="inline-flex items-center justify-center size-11 rounded-2xl bg-[#4F6DF5] text-white shadow-md mb-1">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">SecureGrade</h1>
                    </div>

                    {/* Heading */}
                    <div className="space-y-1 mb-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Student Registration</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Fill in your details to create your student account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 2-Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column: Personal & Credentials */}
                            <div className="space-y-4 bg-slate-50/60 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#4F6DF5] dark:text-indigo-400 flex items-center gap-1.5 pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                                    <Mail className="w-3.5 h-3.5" /> Account Credentials
                                </h3>

                                <div>
                                    <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name <span className="text-rose-500">*</span></Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Juan Dela Cruz"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1"
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address <span className="text-rose-500">*</span></Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="juan.delacruz@school.edu"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1 font-mono text-xs"
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="student_id" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Student ID <span className="text-slate-400 font-normal">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="student_id"
                                        type="text"
                                        value={data.student_id}
                                        onChange={(e) => setData('student_id', e.target.value)}
                                        placeholder="e.g. 2026-001"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1 font-mono text-xs"
                                    />
                                    <InputError message={errors.student_id} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password <span className="text-rose-500">*</span></Label>
                                    <div className="mt-1">
                                        <PasswordInput
                                            id="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                        />
                                    </div>
                                    <InputError message={errors.password} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password <span className="text-rose-500">*</span></Label>
                                    <div className="mt-1">
                                        <PasswordInput
                                            id="password_confirmation"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="••••••••"
                                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} className="mt-1" />
                                </div>
                            </div>

                            {/* Right Column: Academic Details */}
                            <div className="space-y-4 bg-slate-50/60 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#4F6DF5] dark:text-indigo-400 flex items-center gap-1.5 pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                                    <BookOpen className="w-3.5 h-3.5" /> Academic Information
                                </h3>

                                <div>
                                    <Label htmlFor="program" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Course / Program <span className="text-rose-500">*</span></Label>
                                    <select
                                        id="program"
                                        value={data.program}
                                        onChange={(e) => setData('program', e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-semibold"
                                        required
                                    >
                                        {programs.map((prog) => (
                                            <option key={prog} value={prog}>
                                                {prog}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.program} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="semester" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Semester <span className="text-rose-500">*</span></Label>
                                    <select
                                        id="semester"
                                        value={data.semester}
                                        onChange={(e) => setData('semester', e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-medium"
                                        required
                                    >
                                        {semesters.map((sem) => (
                                            <option key={sem} value={sem}>
                                                {sem}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.semester} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="grade_level" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Grade Level <span className="text-rose-500">*</span></Label>
                                    <select
                                        id="grade_level"
                                        value={data.grade_level}
                                        onChange={(e) => setData('grade_level', e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-medium"
                                        required
                                    >
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                    <InputError message={errors.grade_level} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="section" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Section <span className="text-rose-500">*</span></Label>
                                    {sections.length > 0 ? (
                                        <select
                                            id="section"
                                            value={data.section}
                                            onChange={(e) => setData('section', e.target.value)}
                                            className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-medium"
                                            required
                                        >
                                            {sections.map((sec) => (
                                                <option key={sec.id} value={sec.section_name}>
                                                    {sec.section_name} {sec.grade_level ? `(${sec.grade_level})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Input
                                            id="section"
                                            type="text"
                                            required
                                            value={data.section}
                                            onChange={(e) => setData('section', e.target.value)}
                                            placeholder="e.g. BSIT-1A"
                                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1"
                                        />
                                    )}
                                    <InputError message={errors.section} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold shadow-md py-3 rounded-xl transition-all text-sm"
                            disabled={processing}
                        >
                            {processing && <Spinner className="mr-2" />}
                            Complete Student Registration
                        </Button>

                        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                            Already have a student account?{' '}
                            <TextLink href={login()} tabIndex={6} className="font-semibold text-[#4F6DF5] dark:text-indigo-400">
                                Log in
                            </TextLink>
                        </div>
                    </form>
            </div>
        </div>
    );
}
