import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, BookOpen } from 'lucide-react';
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
    description: string | null;
    status: string;
}

interface Props {
    subjects: Subject[];
}

export default function SubjectManagement({ subjects }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        subject_code: '',
        subject_name: '',
        description: '',
        status: 'Active',
    });

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
            description: subject.description ?? '',
            status: subject.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSubject) {
            put(`/admin/subjects/${editingSubject.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/admin/subjects', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subjects Management" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Subjects</h1>
                        <p className="text-sm text-slate-500">Manage course subject codes, names, and descriptions.</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Subject
                    </Button>
                </div>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Subject Code</th>
                                        <th className="p-3">Subject Name</th>
                                        <th className="p-3">Description</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {subjects.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-400">
                                                No subjects found. Click "Add Subject" to create subject offerings.
                                            </td>
                                        </tr>
                                    ) : (
                                        subjects.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-slate-50/50">
                                                <td className="p-3 font-mono font-semibold text-slate-900">{sub.subject_code}</td>
                                                <td className="p-3 font-medium text-slate-800">{sub.subject_name}</td>
                                                <td className="p-3 text-slate-500">{sub.description || '—'}</td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            sub.status === 'Active'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditModal(sub)}>
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
                            <h2 className="text-xl font-bold text-slate-900">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-700">Subject Code</label>
                                    <Input
                                        value={data.subject_code}
                                        onChange={(e) => setData('subject_code', e.target.value)}
                                        placeholder="e.g. IT221"
                                        required
                                    />
                                    {errors.subject_code && <p className="text-xs text-rose-600 mt-1">{errors.subject_code}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700">Subject Name</label>
                                    <Input
                                        value={data.subject_name}
                                        onChange={(e) => setData('subject_name', e.target.value)}
                                        placeholder="Database Management Systems"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700">Description</label>
                                    <Input
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Relational databases, SQL queries, & optimization"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700">Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded-md p-2"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing} className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white">
                                        Save Subject
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
