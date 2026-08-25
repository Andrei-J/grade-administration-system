import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, UserCheck, Layers } from 'lucide-react';
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

interface Instructor {
    id: number;
    instructor_id: string;
    name: string;
    email: string;
    status: string;
    assigned_sections: string;
    assigned_subjects: string;
}

interface Props {
    sections: Section[];
    instructors?: Instructor[];
}

export default function SectionManagement({ sections, instructors = [] }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        grade_level: '1st Year',
        section_name: '',
        school_year: '2026-2027',
        status: 'Active',
    });

    const openCreateModal = () => {
        setEditingSection(null);
        clearErrors();
        reset();
        setData({
            grade_level: '1st Year',
            section_name: '',
            school_year: '2026-2027',
            status: 'Active',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (sec: Section) => {
        setEditingSection(sec);
        clearErrors();
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
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    clearErrors();
                    setEditingSection(null);
                },
            });
        } else {
            post('/admin/sections', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    clearErrors();
                    setEditingSection(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sections & Faculty Management" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Layers className="w-7 h-7 text-[#4F6DF5]" />
                            Year Levels & Sections
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Manage class sections, academic year levels, and assigned faculty instructors.
                        </p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Section
                    </Button>
                </div>

                {/* Sections Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-[#4F6DF5]" />
                                Class Sections Directory
                            </h2>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                                        <th className="p-3.5">Year Level</th>
                                        <th className="p-3.5">Section</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {sections.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-slate-400">
                                                No section records found. Click "Add Section" to configure class sections.
                                            </td>
                                        </tr>
                                    ) : (
                                        sections.map((sec) => (
                                            <tr key={sec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{sec.grade_level}</td>
                                                <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#4F6DF5] font-semibold text-xs border border-blue-100 dark:border-blue-900/50">
                                                        {sec.section_name}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditModal(sec)}>
                                                        <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
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

                {/* Instructors & Faculty Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-[#4F6DF5]" />
                                Instructors & Professors
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Faculty members, assigned section load, and teaching course codes.
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                                        <th className="p-3.5">Instructor / Prof</th>
                                        <th className="p-3.5">Faculty ID</th>
                                        <th className="p-3.5">Assigned Section</th>
                                        <th className="p-3.5">Subjects Taught</th>
                                        <th className="p-3.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {instructors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-400">
                                                No instructor records available.
                                            </td>
                                        </tr>
                                    ) : (
                                        instructors.map((inst) => (
                                            <tr key={inst.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="p-3.5">
                                                    <div className="font-semibold text-slate-900 dark:text-slate-100">{inst.name}</div>
                                                    <div className="text-xs text-slate-400">{inst.email}</div>
                                                </td>
                                                <td className="p-3.5 font-mono text-xs text-slate-600 dark:text-slate-400">{inst.instructor_id}</td>
                                                <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                                                    {inst.assigned_sections !== 'Unassigned' ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                                                            {inst.assigned_sections}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-xs">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="p-3.5 text-xs text-slate-600 dark:text-slate-400">{inst.assigned_subjects}</td>
                                                <td className="p-3.5">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            inst.status === 'Active'
                                                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        {inst.status}
                                                    </span>
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
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{editingSection ? 'Edit Section' : 'Add Section'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Year Level</label>
                                    <select
                                        value={data.grade_level}
                                        onChange={(e) => setData('grade_level', e.target.value)}
                                        className="w-full text-sm border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-md p-2 mt-1 text-slate-900 dark:text-slate-100"
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
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Section Name</label>
                                    <Input
                                        value={data.section_name}
                                        onChange={(e) => setData('section_name', e.target.value)}
                                        placeholder="IT 4-1"
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">School Year</label>
                                    <Input
                                        value={data.school_year}
                                        onChange={(e) => setData('school_year', e.target.value)}
                                        placeholder="2026-2027"
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-sm border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-md p-2 mt-1 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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

