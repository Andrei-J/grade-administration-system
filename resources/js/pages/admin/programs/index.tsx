import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, Trash2, Search, GraduationCap, CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Programs', href: '/admin/programs' },
];

interface Program {
    id: number;
    code: string;
    name: string;
    description: string | null;
    status: string;
    created_at?: string;
    updated_at?: string;
}

interface Props {
    programs: Program[];
}

export default function ProgramManagement({ programs }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        code: '',
        name: '',
        description: '',
        status: 'Active',
    });

    const filteredPrograms = programs.filter(
        (p) =>
            p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const activeCount = programs.filter((p) => p.status === 'Active').length;
    const inactiveCount = programs.filter((p) => p.status === 'Inactive').length;

    const openCreateModal = () => {
        setEditingProgram(null);
        clearErrors();
        reset();
        setData({
            code: '',
            name: '',
            description: '',
            status: 'Active',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (program: Program) => {
        setEditingProgram(program);
        clearErrors();
        setData({
            code: program.code,
            name: program.name,
            description: program.description || '',
            status: program.status,
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (program: Program) => {
        setDeletingProgram(program);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProgram) {
            put(`/admin/programs/${editingProgram.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    clearErrors();
                    setEditingProgram(null);
                },
            });
        } else {
            post('/admin/programs', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    clearErrors();
                    setEditingProgram(null);
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deletingProgram) return;
        router.delete(`/admin/programs/${deletingProgram.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDeletingProgram(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Program Management" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <GraduationCap className="w-7 h-7 text-[#4F6DF5]" />
                            Programs
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Configure academic degree offerings, department course codes, and program status.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white flex items-center gap-2 shadow-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Program
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Total Programs
                                </p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                                    {programs.length}
                                </h3>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-[#4F6DF5]">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Active Programs
                                </p>
                                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                    {activeCount}
                                </h3>
                            </div>
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Inactive Programs
                                </p>
                                <h3 className="text-2xl font-bold text-slate-500 dark:text-slate-400 mt-1">
                                    {inactiveCount}
                                </h3>
                            </div>
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                                <XCircle className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter and Table */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search programs by code or title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                                        <th className="p-3.5">Code</th>
                                        <th className="p-3.5">Program Name & Specialization</th>
                                        <th className="p-3.5">Description</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredPrograms.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-400">
                                                No program records found. Click "Add Program" to configure new degree offerings.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPrograms.map((program) => (
                                            <tr
                                                key={program.id}
                                                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                                            >
                                                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#4F6DF5] font-mono text-xs font-bold border border-blue-100 dark:border-blue-900/50">
                                                        {program.code}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-xs">
                                                    {program.name}
                                                </td>
                                                <td className="p-3.5 text-xs text-slate-500 dark:text-slate-400 max-w-sm truncate">
                                                    {program.description || <span className="italic text-slate-300 dark:text-slate-600">No description provided</span>}
                                                </td>
                                                <td className="p-3.5">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            program.status === 'Active'
                                                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${
                                                                program.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                                                            }`}
                                                        />
                                                        {program.status}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-right space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(program)}
                                                        className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                    >
                                                        <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openDeleteModal(program)}
                                                        className="hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Create / Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                    {editingProgram ? 'Edit Program' : 'Create New Program'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Program Code (e.g. BSIT) *
                                    </label>
                                    <Input
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="BSIT"
                                        required
                                        className="mt-1 font-mono uppercase"
                                    />
                                    {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Full Program Name *
                                    </label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Bachelor of Science in Information Technology"
                                        required
                                        className="mt-1"
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Description & Specialization Notes
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Enter program outline or major specialization description..."
                                        rows={3}
                                        className="w-full text-sm border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-md p-2.5 mt-1 focus:ring-2 focus:ring-[#4F6DF5] focus:outline-none"
                                    />
                                    {errors.description && (
                                        <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Status
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-sm border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-md p-2.5 mt-1 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white"
                                    >
                                        {editingProgram ? 'Update Program' : 'Save Program'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && deletingProgram && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                Delete Program "{deletingProgram.code}"?
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Are you sure you want to remove <strong className="text-slate-900 dark:text-slate-100">{deletingProgram.name}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Confirm Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
