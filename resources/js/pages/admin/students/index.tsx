import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Student Management', href: '/admin/students' },
];

interface Student {
    id: number;
    student_id: string;
    name: string;
    grade_level: string;
    section: string;
    school_year: string;
    status: string;
}

interface Section {
    id: number;
    grade_level: string;
    section_name: string;
    school_year: string;
}

interface Props {
    students: Student[];
    sections: Section[];
    filters: {
        search?: string;
        grade_level?: string;
        section?: string;
        school_year?: string;
    };
}

export default function StudentManagement({ students, sections, filters }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        student_id: '',
        name: '',
        grade_level: 'Grade 12',
        section: 'IT-1',
        school_year: '2026-2027',
        status: 'Active',
    });

    const openCreateModal = () => {
        setEditingStudent(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (student: Student) => {
        setEditingStudent(student);
        setData({
            student_id: student.student_id,
            name: student.name,
            grade_level: student.grade_level,
            section: student.section,
            school_year: student.school_year,
            status: student.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStudent) {
            put(`/admin/students/${editingStudent.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/admin/students', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this student record?')) {
            router.delete(`/admin/students/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Management" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Student Records</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage student roster, grade levels, sections, and academic status.</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Student
                    </Button>
                </div>

                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Student ID</th>
                                        <th className="p-3">Full Name</th>
                                        <th className="p-3">Grade Level</th>
                                        <th className="p-3">Section</th>
                                        <th className="p-3">School Year</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                No student records found. Click "Add New Student" to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((st) => (
                                            <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                <td className="p-3 font-mono font-semibold text-slate-900 dark:text-white">{st.student_id}</td>
                                                <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{st.name}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{st.grade_level}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{st.section}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{st.school_year}</td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            st.status === 'Active'
                                                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        {st.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditModal(st)}>
                                                        <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(st.id)}>
                                                        <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
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
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 text-slate-900 dark:text-slate-100">
                            <h2 className="text-xl font-bold">{editingStudent ? 'Edit Student' : 'Add Student'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Student ID</label>
                                    <Input
                                        value={data.student_id}
                                        onChange={(e) => setData('student_id', e.target.value)}
                                        placeholder="e.g. 2026-001"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Juan Dela Cruz"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Grade Level</label>
                                        <Input
                                            value={data.grade_level}
                                            onChange={(e) => setData('grade_level', e.target.value)}
                                            placeholder="Grade 12"
                                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Section</label>
                                        <Input
                                            value={data.section}
                                            onChange={(e) => setData('section', e.target.value)}
                                            placeholder="IT-1"
                                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">School Year</label>
                                    <Input
                                        value={data.school_year}
                                        onChange={(e) => setData('school_year', e.target.value)}
                                        placeholder="2026-2027"
                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2"
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
                                        Save Student
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
