import { useState, useMemo } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, UserCheck, ShieldAlert, CheckCircle2, AlertCircle, Users, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/password-input';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Instructor Management', href: '/admin/instructors' },
];

interface Instructor {
    id: number;
    instructor_id: string;
    name: string;
    email: string;
    status: string;
}

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Props {
    instructors: Instructor[];
}

export default function InstructorManagement({ instructors }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { flash } = usePage().props as PageProps;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        instructor_id: '',
        name: '',
        email: '',
        password: '',
        status: 'Active',
    });

    const filteredInstructors = useMemo(() => {
        return instructors.filter(
            (inst) =>
                !searchQuery ||
                inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inst.instructor_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inst.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [instructors, searchQuery]);

    const metrics = useMemo(() => {
        const total = instructors.length;
        const active = instructors.filter((i) => i.status === 'Active').length;
        const inactive = total - active;
        return { total, active, inactive };
    }, [instructors]);

    const openCreateModal = () => {
        setEditingInstructor(null);
        clearErrors();
        reset();
        setData({
            instructor_id: '',
            name: '',
            email: '',
            password: '',
            status: 'Active',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (instructor: Instructor) => {
        setEditingInstructor(instructor);
        clearErrors();
        setData({
            instructor_id: instructor.instructor_id,
            name: instructor.name,
            email: instructor.email,
            password: '',
            status: instructor.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingInstructor) {
            put(`/admin/instructors/${editingInstructor.id}`, {
                onSuccess: (page) => {
                    const pageProps = page.props as PageProps;
                    if (!pageProps.flash?.error) {
                        setIsModalOpen(false);
                        reset();
                        clearErrors();
                        setEditingInstructor(null);
                    }
                },
            });
        } else {
            post('/admin/instructors', {
                onSuccess: (page) => {
                    const pageProps = page.props as PageProps;
                    if (!pageProps.flash?.error) {
                        setIsModalOpen(false);
                        reset();
                        clearErrors();
                        setEditingInstructor(null);
                    }
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Instructor Management" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">
                                Faculty Administration
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Instructors & Faculty Directory</h1>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Manage instructor credentials, portal permissions, and active status accounts.</p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md transition-all shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Add Instructor Account
                    </Button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Instructors</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{metrics.total}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Faculty</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{metrics.active}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Inactive / Restricted</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{metrics.inactive}</h3>
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
                                    placeholder="Search by instructor name, ID, or email..."
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
                                        <th className="p-3.5">Instructor ID</th>
                                        <th className="p-3.5">Full Name</th>
                                        <th className="p-3.5">Email Address</th>
                                        <th className="p-3.5">Portal Status</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {filteredInstructors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-slate-400 dark:text-slate-500">
                                                No instructors found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredInstructors.map((inst) => {
                                            const initial = inst.name ? inst.name.charAt(0).toUpperCase() : 'I';
                                            const isActive = inst.status === 'Active';
                                            return (
                                                <tr key={inst.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                                    <td className="p-3.5 font-mono font-semibold text-slate-900 dark:text-white">
                                                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200/60 dark:border-slate-700/60 text-xs">
                                                            {inst.instructor_id}
                                                        </span>
                                                    </td>
                                                    <td className="p-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
                                                                {initial}
                                                            </div>
                                                            <span className="font-semibold text-slate-900 dark:text-white">{inst.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">{inst.email}</td>
                                                    <td className="p-3.5">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                                isActive
                                                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                                                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                                                            }`}
                                                        >
                                                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                            {inst.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3.5 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditModal(inst)}
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

                {/* Edit / Add Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div>
                                    <h2 className="text-xl font-bold">{editingInstructor ? 'Edit Instructor' : 'Add Instructor Account'}</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Configure portal access and instructor information.</p>
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
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Instructor ID</label>
                                    <Input
                                        value={data.instructor_id}
                                        onChange={(e) => setData('instructor_id', e.target.value)}
                                        placeholder="INS-2026-01"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 mt-1 font-mono"
                                        required
                                    />
                                    {errors.instructor_id && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.instructor_id}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Maria Santos"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="maria.santos@school.edu"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 mt-1 font-mono text-xs"
                                        required
                                    />
                                    {errors.email && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        {editingInstructor ? 'New Password (leave blank to keep current)' : 'Password'}
                                    </label>
                                    <div className="mt-1">
                                        <PasswordInput
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            required={!editingInstructor}
                                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                        />
                                    </div>
                                    {errors.password && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Portal Access Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-medium"
                                    >
                                        <option value="Active">Active (Can Log In)</option>
                                        <option value="Inactive">Inactive (Blocked Access)</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing} className="bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold rounded-xl">
                                        Save Account
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
