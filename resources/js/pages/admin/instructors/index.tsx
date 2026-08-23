import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, UserCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface Props {
    instructors: Instructor[];
}

export default function InstructorManagement({ instructors }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        instructor_id: '',
        name: '',
        email: '',
        password: '',
        status: 'Active',
    });

    const openCreateModal = () => {
        setEditingInstructor(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (instructor: Instructor) => {
        setEditingInstructor(instructor);
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
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/admin/instructors', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Instructor Management" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Instructors & Faculty</h1>
                        <p className="text-sm text-slate-500">Manage instructor accounts, email credentials, and active login statuses.</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Instructor Account
                    </Button>
                </div>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Instructor ID</th>
                                        <th className="p-3">Full Name</th>
                                        <th className="p-3">Email Address</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {instructors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-400">
                                                No instructors found. Click "Add Instructor Account" to register faculty.
                                            </td>
                                        </tr>
                                    ) : (
                                        instructors.map((inst) => (
                                            <tr key={inst.id} className="hover:bg-slate-50/50">
                                                <td className="p-3 font-mono font-semibold text-slate-900">{inst.instructor_id}</td>
                                                <td className="p-3 font-medium text-slate-800">{inst.name}</td>
                                                <td className="p-3 text-slate-600">{inst.email}</td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            inst.status === 'Active'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-rose-100 text-rose-700'
                                                        }`}
                                                    >
                                                        {inst.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditModal(inst)}>
                                                        <Edit className="w-4 h-4 text-slate-600" />
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

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">{editingInstructor ? 'Edit Instructor' : 'Add Instructor Account'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-700">Instructor ID</label>
                                    <Input
                                        value={data.instructor_id}
                                        onChange={(e) => setData('instructor_id', e.target.value)}
                                        placeholder="INS-2026-01"
                                        required
                                    />
                                    {errors.instructor_id && <p className="text-xs text-rose-600 mt-1">{errors.instructor_id}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700">Full Name</label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Maria Santos"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700">Email Address</label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="maria.santos@school.edu"
                                        required
                                    />
                                    {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                                </div>

                                {!editingInstructor && (
                                    <div>
                                        <label className="text-xs font-medium text-slate-700">Initial Password</label>
                                        <Input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-medium text-slate-700">Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded-md p-2"
                                    >
                                        <option value="Active">Active (Can Log In)</option>
                                        <option value="Inactive">Inactive (Blocked)</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing} className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white">
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
