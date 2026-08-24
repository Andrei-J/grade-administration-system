import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Sections', href: '/admin/sections' },
];

interface Section {
    id: number;
    grade_level: string;
    section_name: string;
    school_year: string;
    status: string;
}

interface Props {
    sections: Section[];
}

export default function SectionManagement({ sections }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        grade_level: '1st Year',
        section_name: '',
        school_year: '2026-2027',
        status: 'Active',
    });

    const openCreateModal = () => {
        setEditingSection(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (sec: Section) => {
        setEditingSection(sec);
        setData({
            grade_level: sec.grade_level,
            section_name: sec.section_name,
            school_year: sec.school_year,
            status: sec.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSection) {
            put(`/admin/sections/${editingSection.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/admin/sections', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sections Management" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Grade Levels & Sections</h1>
                        <p className="text-sm text-slate-500">Manage class section names, academic year levels, and school year cohorts.</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Section
                    </Button>
                </div>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Grade Level</th>
                                        <th className="p-3">Section Name</th>
                                        <th className="p-3">School Year</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {sections.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-400">
                                                No section records found. Click "Add Section" to configure class sections.
                                            </td>
                                        </tr>
                                    ) : (
                                        sections.map((sec) => (
                                            <tr key={sec.id} className="hover:bg-slate-50/50">
                                                <td className="p-3 font-semibold text-slate-900">{sec.grade_level}</td>
                                                <td className="p-3 font-medium text-slate-800">{sec.section_name}</td>
                                                <td className="p-3 text-slate-600">{sec.school_year}</td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            sec.status === 'Active'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {sec.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditModal(sec)}>
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
                            <h2 className="text-xl font-bold text-slate-900">{editingSection ? 'Edit Section' : 'Add Section'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-700">Grade Level</label>
                                    <select
                                        value={data.grade_level}
                                        onChange={(e) => setData('grade_level', e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded-md p-2 mt-1"
                                        required
                                    >
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                        <option value="5th Year">5th Year</option>
                                        <option value="6th Year">6th Year</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700">Section Name</label>
                                    <Input
                                        value={data.section_name}
                                        onChange={(e) => setData('section_name', e.target.value)}
                                        placeholder="IT-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700">School Year</label>
                                    <Input
                                        value={data.school_year}
                                        onChange={(e) => setData('school_year', e.target.value)}
                                        placeholder="2026-2027"
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
                                        Save Section
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
