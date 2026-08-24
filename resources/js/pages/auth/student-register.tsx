import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { GraduationCap, Mail, BookOpen } from 'lucide-react';

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
    programs = ['BSAIT', 'BSIT', 'BSCS', 'BSEMC'],
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
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
            <Head title="Student Registration — Secure Grade Administration" />

            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-6">
                {/* Header Logo */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-[#4F6DF5] text-white shadow-md mb-2">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Registration</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Create your student account to access grades and academic rankings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Personal & Credentials */}
                        <div className="space-y-4 bg-slate-50/60 dark:bg-slate-800/40 p-4.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
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
                        <div className="space-y-4 bg-slate-50/60 dark:bg-slate-800/40 p-4.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
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
