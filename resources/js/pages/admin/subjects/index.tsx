import { useState, useMemo } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, BookOpen, X, Key, CheckCircle2, AlertCircle, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Subjects', href: '/admin/subjects' },
];

interface Subject {
    id: number;
    subject_code: string;
    subject_name: string;
    password?: string | null;
    description: string | null;
    status: string;
}

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Props {
    subjects: Subject[];
}

export default function SubjectManagement({ subjects }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { flash } = usePage().props as PageProps;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        subject_code: '',
        subject_name: '',
        password: '',
        description: '',
        status: 'Active',
    });

    const filteredSubjects = useMemo(() => {
        return subjects.filter(
            (sub) =>
                !searchQuery ||
                sub.subject_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sub.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (sub.password && sub.password.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [subjects, searchQuery]);

    const metrics = useMemo(() => {
        const total = subjects.length;
        const protectedCount = subjects.filter((s) => Boolean(s.password)).length;
        const active = subjects.filter((s) => s.status === 'Active').length;
        return { total, protectedCount, active };
    }, [subjects]);

    const openCreateModal = () => {
        setEditingSubject(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (subject: Subject) => {
        setEditingSubject(subject);
        setData({
            subject_code: subject.subject_code,
            subject_name: subject.subject_name,
            password: subject.password ?? '',
            description: subject.description ?? '',
            status: subject.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSubject) {
            put(`/admin/subjects/${editingSubject.id}`, {
                onSuccess: (page) => {
                    const pageProps = page.props as PageProps;
                    if (!pageProps.flash?.error) {
                        setIsModalOpen(false);
                    }
                },
            });
        } else {
            post('/admin/subjects', {
                onSuccess: (page) => {
                    const pageProps = page.props as PageProps;
                    if (!pageProps.flash?.error) {
                        setIsModalOpen(false);
                    }
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subjects Management" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800">
                                Curriculum Offerings
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Academic Subject Catalog</h1>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Manage subject offerings, access password codes, descriptions, and active status.</p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md transition-all shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Subject
                    </Button>
                </div>

                {/* KPI Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Courses Offered</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{metrics.total}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
                            <Key className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Protected by Passcode</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{metrics.protectedCount}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Subjects</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{metrics.active}</h3>
                        </div>
                    </div>
                </div>

                {/* Result Messages */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && !isModalOpen && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3 shadow-sm">
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4 md:p-6 space-y-5">
                        {/* Search Toolbar */}
                        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by subject code, name, or password..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                                        <th className="p-3.5">Subject Code</th>
                                        <th className="p-3.5">Subject Name</th>
                                        <th className="p-3.5">Access Password Code</th>
                                        <th className="p-3.5">Description</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {filteredSubjects.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-slate-400 dark:text-slate-500">
                                                No subjects found. Click "Add New Subject" to create a course offering.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSubjects.map((sub) => {
                                            const isActive = sub.status === 'Active';
                                            return (
                                                <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                                    <td className="p-3.5 font-mono font-semibold text-slate-900 dark:text-white">
                                                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200/60 dark:border-slate-700/60 text-xs">
                                                            {sub.subject_code}
                                                        </span>
                                                    </td>
                                                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{sub.subject_name}</td>
                                                    <td className="p-3.5 font-mono text-xs">
                                                        {sub.password ? (
                                                            <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-md font-semibold border border-purple-200/60 dark:border-purple-800 inline-flex items-center gap-1.5 shadow-sm">
                                                                <Key className="w-3 h-3 text-purple-500" />
                                                                {sub.password}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 dark:text-slate-500 italic text-xs">No passcode required</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3.5 text-slate-600 dark:text-slate-400 text-xs">{sub.description || '—'}</td>
                                                    <td className="p-3.5">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                                isActive
                                                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                            }`}
                                                        >
                                                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3.5 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditModal(sub)}
                                                            className="hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg"
                                                        >
                                                            <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit / Add Subject Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div>
                                    <h2 className="text-xl font-bold">{editingSubject ? 'Edit Subject Details' : 'Create New Subject'}</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Configure course codes and optional passcode protection.</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {flash?.error && (
                                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                    <span>{flash.error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Subject Code <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        value={data.subject_code}
                                        onChange={(e) => setData('subject_code', e.target.value)}
                                        placeholder="e.g. IT221, CS101"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono uppercase mt-1"
                                        required
                                    />
                                    {errors.subject_code && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.subject_code}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Subject Name <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        value={data.subject_name}
                                        onChange={(e) => setData('subject_name', e.target.value)}
                                        placeholder="Database Management Systems"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1"
                                        required
                                    />
                                    {errors.subject_name && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.subject_name}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Subject Password Code <span className="text-slate-400 font-normal">(Optional for Enrollment)</span>
                                    </label>
                                    <Input
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="e.g. PASS2026, IT111-KEY"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono mt-1"
                                    />
                                    {errors.password && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
                                    <Input
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Relational databases, SQL queries, & optimization"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1"
                                    />
                                    {errors.description && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Offering Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-medium"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing} className="bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold rounded-xl">
                                        {editingSubject ? 'Update Subject' : 'Save Subject'}
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
