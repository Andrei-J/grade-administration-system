import { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { BookOpen, User, Plus, Key, CheckCircle2, AlertCircle, X, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Student Dashboard', href: '/student/dashboard' },
    { title: 'My Subjects', href: '/student/subjects' },
];

interface StudentInfo {
    name: string;
    student_id: string;
    section: string;
    grade_level: string;
    program?: string;
    semester?: string;
}

interface SubjectItem {
    id: string;
    code: string;
    name: string;
    description: string;
    instructor: string;
    final_average: string;
    status: string;
}

interface AvailableSubject {
    id: string;
    subject_code: string;
    subject_name: string;
    description?: string | null;
    instructor?: string;
    is_already_enrolled?: boolean;
}

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Props {
    studentInfo: StudentInfo;
    subjects: SubjectItem[];
    availableSubjects?: AvailableSubject[];
    errorMessage?: string | null;
}

export default function StudentSubjectsIndex({
    studentInfo,
    subjects,
    availableSubjects = [],
    errorMessage = null,
}: Props) {
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [enrollingCode, setEnrollingCode] = useState<string | null>(null);
    const { flash } = usePage().props as PageProps;

    const { data, setData, post, processing, errors, reset } = useForm({
        subject_code: '',
    });

    const handleEnrollSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/student/subjects/enroll', {
            onSuccess: (page) => {
                const pageProps = page.props as PageProps;
                if (!pageProps.flash?.error) {
                    setIsEnrollModalOpen(false);
                    reset();
                }
            },
        });
    };

    const handleDirectEnroll = (code: string) => {
        setEnrollingCode(code);
        router.post('/student/subjects/enroll', { subject_code: code }, {
            onFinish: () => setEnrollingCode(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Subjects" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 border border-blue-200/50 dark:border-blue-800">
                            <BookOpen className="w-3.5 h-3.5" />
                            Academic Enrollment
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            My Subjects
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {studentInfo.name} • <span className="font-semibold text-indigo-600 dark:text-indigo-400">{studentInfo.program || 'BSAIT'}</span> • <span>{studentInfo.semester || '1st Semester'}</span> • {studentInfo.grade_level} - <span className="font-semibold text-blue-600 dark:text-blue-400">{studentInfo.section}</span>
                        </p>
                    </div>

                    {!errorMessage && (
                        <Button
                            onClick={() => setIsEnrollModalOpen(true)}
                            className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white flex items-center gap-2 rounded-xl shadow-sm shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            Enroll in a Subject
                        </Button>
                    )}
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && !isEnrollModalOpen && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Error Banner for Missing Subjects / Incorrect Section */}
                {errorMessage && (
                    <Card className="border-amber-200 dark:border-amber-800/80 bg-amber-50/80 dark:bg-amber-950/40 p-6 md:p-8 rounded-2xl shadow-sm">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-2xl shrink-0">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
                                    Subject Availability Notice
                                </h3>
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                    {errorMessage}
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                    Please get in touch with your school administrator to verify your section assignment or to assign subjects to section <span className="font-bold">{studentInfo.section}</span>.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Available Section Subjects (Professors' subjects for student's section) */}
                {availableSubjects.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-blue-500" />
                                    Available Subjects for Section {studentInfo.section}
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    These are the subjects assigned by professors specifically for your section.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableSubjects.map((as) => (
                                <Card key={as.id || as.subject_code} className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                    <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg border border-blue-200/60 dark:border-blue-800 font-mono">
                                                {as.subject_code}
                                            </span>
                                            {as.is_already_enrolled ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                                    <Check className="w-3 h-3" />
                                                    Enrolled
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                    Available
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white mt-2">
                                            {as.subject_name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-3 space-y-3 flex-1 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                                {as.description || 'No description provided.'}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                <span>Professor: <span className="font-semibold text-slate-700 dark:text-slate-300">{as.instructor}</span></span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                                            {as.is_already_enrolled ? (
                                                <Button disabled variant="outline" className="w-full text-xs h-9 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                                    Already Enrolled
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => handleDirectEnroll(as.subject_code)}
                                                    disabled={enrollingCode === as.subject_code}
                                                    className="w-full text-xs h-9 bg-[#4F6DF5] hover:bg-[#4058D6] text-white rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    {enrollingCode === as.subject_code ? 'Enrolling...' : 'Enroll in Subject'}
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* My Enrolled Subjects Grid */}
                <div className="space-y-4 pt-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        My Enrolled Classes
                    </h2>

                    {subjects.length === 0 ? (
                        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-8 md:p-12 text-center rounded-2xl">
                            <div className="flex flex-col items-center space-y-3">
                                <div className="p-4 bg-blue-50 dark:bg-blue-950/60 rounded-full text-blue-600 dark:text-blue-400">
                                    <Key className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Enrolled Classes Yet</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                                    {availableSubjects.length > 0
                                        ? "Click 'Enroll in Subject' on any of your section's available subjects above to enroll in a class."
                                        : "Enter a subject code or contact admin if no subjects are assigned to your section."}
                                </p>
                                {!errorMessage && availableSubjects.length === 0 && (
                                    <Button
                                        onClick={() => setIsEnrollModalOpen(true)}
                                        className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white mt-2 flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Enroll with Subject Code
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subjects.map((s) => (
                                <Card key={s.id} className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg border border-blue-200/60 dark:border-blue-800 font-mono">
                                                {s.code}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    s.status === 'Passed'
                                                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                                        : s.status === 'Failed'
                                                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                                                        : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                                                }`}
                                            >
                                                {s.status}
                                            </span>
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white mt-2">
                                            {s.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-3 space-y-3">
                                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {s.description || 'No description provided.'}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                <span>Instructor: <span className="font-semibold text-slate-700 dark:text-slate-300">{s.instructor}</span></span>
                                            </div>
                                            {s.final_average !== 'N/A' && (
                                                <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                    Grade: {s.final_average}
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Enrollment Modal */}
                {isEnrollModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in duration-150">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Enroll in a Subject</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Select or enter a subject code for section {studentInfo.section}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEnrollModalOpen(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Flash Error Banner inside Modal */}
                            {flash?.error && (
                                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2.5 shadow-sm">
                                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                    <span>{flash.error}</span>
                                </div>
                            )}

                            {availableSubjects.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Select from Section Subjects
                                    </label>
                                    <select
                                        onChange={(e) => setData('subject_code', e.target.value)}
                                        value={data.subject_code}
                                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="">-- Select a subject --</option>
                                        {availableSubjects.map((as) => (
                                            <option key={as.id || as.subject_code} value={as.subject_code}>
                                                {as.subject_code} - {as.subject_name} ({as.instructor}) {as.is_already_enrolled ? '[Already Enrolled]' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <form onSubmit={handleEnrollSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Subject Code
                                    </label>
                                    <Input
                                        value={data.subject_code}
                                        onChange={(e) => setData('subject_code', e.target.value)}
                                        placeholder="e.g. IT101"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1 font-mono uppercase"
                                        autoFocus
                                        required
                                    />
                                    {errors.subject_code && (
                                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.subject_code}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEnrollModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.subject_code.trim()}
                                        className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white font-semibold"
                                    >
                                        Enroll Now
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

