import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Instructor Assignments', href: '/admin/assignments' },
];

interface Assignment {
    id: number;
    instructor_id: string;
    subject_id: string;
    section_id: string;
    school_year: string;
    status: string;
    instructor?: { name: string; email: string };
    subject?: { subject_name: string };
}

interface Instructor {
    instructor_id: string;
    name: string;
    email: string;
}

interface Subject {
    subject_code: string;
    subject_name: string;
}

interface Section {
    section_name: string;
    grade_level: string;
    school_year: string;
}

interface Props {
    assignments: Assignment[];
    instructors: Instructor[];
    subjects: Subject[];
    sections: Section[];
}

export default function AssignmentManagement({ assignments, instructors, subjects, sections }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

    const { data, setData, post, put, processing, reset } = useForm({
        instructor_id: instructors[0]?.email || '',
        subject_id: subjects[0]?.subject_code || '',
        section_id: sections[0]?.section_name || '',
        school_year: '2026-2027',
        status: 'Active',
    });

    const openCreateModal = () => {
        setEditingAssignment(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (asgn: Assignment) => {
        setEditingAssignment(asgn);
        setData({
            instructor_id: asgn.instructor_id,
            subject_id: asgn.subject_id,
            section_id: asgn.section_id,
            school_year: asgn.school_year,
            status: asgn.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAssignment) {
            put(`/admin/assignments/${editingAssignment.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/admin/assignments', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Class Assignments" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Instructor Class Assignments</h1>
                        <p className="text-sm text-slate-500">Assign instructors to subjects, grade levels, sections, and academic school years.</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Assign Instructor
                    </Button>
                </div>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Instructor</th>
                                        <th className="p-3">Subject</th>
                                        <th className="p-3">Section</th>
                                        <th className="p-3">School Year</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {assignments.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-400">
                                                No instructor assignments recorded. Click "Assign Instructor" to link faculty to classes.
                                            </td>
                                        </tr>
                                    ) : (
                                        assignments.map((asgn) => (
                                            <tr key={asgn.id} className="hover:bg-slate-50/50">
                                                <td className="p-3 font-medium text-slate-900">
                                                    {asgn.instructor?.name || asgn.instructor_id}
                                                </td>
                                                <td className="p-3 font-mono text-slate-800">
                                                    <span className="font-semibold">{asgn.subject_id}</span>
                                                    {asgn.subject?.subject_name && ` — ${asgn.subject.subject_name}`}
                                                </td>
                                                <td className="p-3 text-slate-600 font-medium">{asgn.section_id}</td>
                                                <td className="p-3 text-slate-600">{asgn.school_year}</td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            asgn.status === 'Active'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {asgn.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditModal(asgn)}>
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
                            <h2 className="text-xl font-bold text-slate-900">{editingAssignment ? 'Edit Assignment' : 'Assign Instructor'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-700">Select Instructor</label>
                                    <select
                                        value={data.instructor_id}
                                        onChange={(e) => setData('instructor_id', e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded-md p-2"
                                        required
                                    >
                                        {instructors.map((i) => (
                                            <option key={i.instructor_id} value={i.email}>
                                                {i.name} ({i.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700">Select Subject</label>
                                    <select
                                        value={data.subject_id}
                                        onChange={(e) => setData('subject_id', e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded-md p-2"
                                        required
                                    >
                                        {subjects.map((s) => (
                                            <option key={s.subject_code} value={s.subject_code}>
                                                {s.subject_code} — {s.subject_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700">Select Section</label>
                                    <select
                                        value={data.section_id}
                                        onChange={(e) => setData('section_id', e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded-md p-2"
                                        required
                                    >
                                        {sections.map((sec, idx) => (
                                            <option key={idx} value={sec.section_name}>
                                                {sec.grade_level} — {sec.section_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700">School Year</label>
                                    <input
                                        type="text"
                                        value={data.school_year}
                                        onChange={(e) => setData('school_year', e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded-md p-2"
                                        required
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
                                        Save Assignment
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
