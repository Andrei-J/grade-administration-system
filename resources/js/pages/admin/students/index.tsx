import { useState, useMemo } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle, X, Users, UserCheck, GraduationCap, Calendar, Search, Filter, RotateCcw, ShieldCheck, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/password-input';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Student Management', href: '/admin/students' },
];

interface Student {
    id: number;
    student_id: string;
    name: string;
    email?: string;
    grade_level: string;
    section: string;
    program?: string;
    semester?: string;
    school_year: string;
    status: string;
}

interface Section {
    id: number;
    grade_level: string;
    section_name: string;
    school_year: string;
}

interface Program {
    id: number;
    code: string;
    name: string;
}

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Props {
    students: Student[];
    sections: Section[];
    programs?: Program[];
    filters: {
        search?: string;
        grade_level?: string;
        section?: string;
        school_year?: string;
    };
}

export default function StudentManagement({ students, sections = [], programs = [], filters }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const { flash } = usePage().props as PageProps;

    // Filter states
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedGrade, setSelectedGrade] = useState(filters?.grade_level || 'all');
    const [selectedSection, setSelectedSection] = useState(filters?.section || 'all');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        name: '',
        email: '',
        password: '',
        grade_level: '1st Year',
        section: sections[0]?.section_name || '',
        program: programs[0]?.code || 'BSAIT',
        semester: '1st Semester',
        school_year: '2026-2027',
        status: 'Active',
    });

    // Client-side quick filter
    const filteredStudents = useMemo(() => {
        return students.filter((st) => {
            const matchesSearch =
                !searchQuery ||
                st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                st.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (st.email && st.email.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesGrade = selectedGrade === 'all' || st.grade_level === selectedGrade;
            const matchesSec = selectedSection === 'all' || st.section === selectedSection;

            return matchesSearch && matchesGrade && matchesSec;
        });
    }, [students, searchQuery, selectedGrade, selectedSection]);

    // KPI Summary Metrics
    const metrics = useMemo(() => {
        const total = students.length;
        const active = students.filter((s) => s.status === 'Active').length;
        const uniqueSections = new Set(students.map((s) => s.section)).size;
        return { total, active, uniqueSections };
    }, [students]);

    const openCreateModal = () => {
        setEditingStudent(null);
        clearErrors();
        reset();
        setData({
            student_id: '',
            name: '',
            email: '',
            password: '',
            grade_level: '1st Year',
            section: sections[0]?.section_name || '',
            program: programs[0]?.code || 'BSAIT',
            semester: '1st Semester',
            school_year: '2026-2027',
            status: 'Active',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (student: Student) => {
        setEditingStudent(student);
        clearErrors();
        setData({
            student_id: student.student_id,
            name: student.name,
            email: student.email || '',
            password: '',
            grade_level: student.grade_level,
            section: student.section,
            program: student.program || (programs[0]?.code || 'BSAIT'),
            semester: student.semester || '1st Semester',
            school_year: student.school_year,
            status: student.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStudent) {
            put(`/admin/students/${editingStudent.id}`, {
                onSuccess: (page) => {
                    const pageProps = page.props as PageProps;
                    if (!pageProps.flash?.error) {
                        setIsModalOpen(false);
                        reset();
                        clearErrors();
                        setEditingStudent(null);
                    }
                },
            });
        } else {
            post('/admin/students', {
                onSuccess: (page) => {
                    const pageProps = page.props as PageProps;
                    if (!pageProps.flash?.error) {
                        setIsModalOpen(false);
                        reset();
                        clearErrors();
                        setEditingStudent(null);
                    }
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this student record?')) {
            router.delete(`/admin/students/${id}`);
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedGrade('all');
        setSelectedSection('all');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Management System" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                {/* Top Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800">
                                Administrative Directory
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Student Roster Management</h1>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Oversee student enrollments, academic sections, portal credentials, and active statuses.</p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md transition-all shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Student
                    </Button>
                </div>

                {/* KPI Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Enrolled</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{metrics.total}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Roster</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{metrics.active}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Assigned Sections</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{metrics.uniqueSections}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Academic Year</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">2026-2027</h3>
                        </div>
                    </div>
                </div>

                {/* Result Flash Messages */}
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

                {/* Main Card with Search & Table */}
                <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4 md:p-6 space-y-5">
                        {/* Search & Filter Toolbar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by student name, ID, or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <select
                                    value={selectedGrade}
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                    className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl p-2.5 font-medium"
                                >
                                    <option value="all">All Grade Levels</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>

                                <select
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl p-2.5 font-medium"
                                >
                                    <option value="all">All Sections</option>
                                    {sections.map((sec) => (
                                        <option key={sec.id} value={sec.section_name}>
                                            {sec.section_name}
                                        </option>
                                    ))}
                                </select>

                                {(searchQuery || selectedGrade !== 'all' || selectedSection !== 'all') && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={resetFilters}
                                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Student Directory Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                                        <th className="p-3.5">Student ID</th>
                                        <th className="p-3.5">Full Name & Email</th>
                                        <th className="p-3.5">Program</th>
                                        <th className="p-3.5">Semester</th>
                                        <th className="p-3.5">Grade Level</th>
                                        <th className="p-3.5">Section</th>
                                        <th className="p-3.5">School Year</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="p-12 text-center text-slate-400 dark:text-slate-500">
                                                No student records found matching your filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((st) => {
                                            const initial = st.name ? st.name.charAt(0).toUpperCase() : 'S';
                                            const isActive = st.status === 'Active';
                                            return (
                                                <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                                    <td className="p-3.5 font-mono font-semibold text-slate-900 dark:text-white">
                                                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200/60 dark:border-slate-700/60 text-xs">
                                                            {st.student_id}
                                                        </span>
                                                    </td>
                                                    <td className="p-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
                                                                {initial}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900 dark:text-white">{st.name}</p>
                                                                {st.email ? (
                                                                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{st.email}</p>
                                                                ) : (
                                                                    <p className="text-xs italic text-slate-400">No email linked</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3.5 font-bold text-[#4F6DF5] dark:text-indigo-400 text-xs">{st.program || 'BSAIT'}</td>
                                                    <td className="p-3.5 text-slate-700 dark:text-slate-300 text-xs">{st.semester || '1st Semester'}</td>
                                                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{st.grade_level}</td>
                                                    <td className="p-3.5">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800">
                                                            {st.section}
                                                        </span>
                                                    </td>
                                                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">{st.school_year}</td>
                                                    <td className="p-3.5">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                                isActive
                                                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                            }`}
                                                        >
                                                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                            {st.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3.5 text-right space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditModal(st)}
                                                            className="hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg"
                                                        >
                                                            <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(st.id)}
                                                            className="hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400" />
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

                {/* Create / Edit Student Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] my-auto flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                            {/* Modal Header */}
                            <div className="px-6 py-5 md:px-8 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-slate-900 shrink-0">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                                            {editingStudent ? 'Edit Mode' : 'New Enrollment'}
                                        </span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">{editingStudent ? 'Edit Student Profile' : 'Register New Student'}</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Fill in the required information to create or update student credentials and academic section.</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Scrollable Body */}
                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                                <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                                    {flash?.error && (
                                        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-3 shadow-sm">
                                            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                            <span>{flash.error}</span>
                                        </div>
                                    )}

                                    {/* 2-Column Wide Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column: Personal & Credentials */}
                                        <div className="space-y-4 bg-slate-50/60 dark:bg-slate-800/40 p-4.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4F6DF5] dark:text-indigo-400 flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5" /> 1. Account & Credentials
                                            </h3>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Student ID <span className="text-rose-500">*</span></label>
                                                <Input
                                                    value={data.student_id}
                                                    onChange={(e) => setData('student_id', e.target.value)}
                                                    placeholder="e.g. 2026-001"
                                                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1 font-mono text-xs"
                                                    required
                                                />
                                                {errors.student_id && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.student_id}</p>}
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name <span className="text-rose-500">*</span></label>
                                                <Input
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="e.g. Juan Dela Cruz"
                                                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1"
                                                    required
                                                />
                                                {errors.name && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.name}</p>}
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                                                </label>
                                                <Input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="student@school.edu"
                                                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1 font-mono text-xs"
                                                />
                                                {errors.email && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    {editingStudent ? 'New Password' : 'Account Password'} <span className="text-slate-400 font-normal">(Default: password123)</span>
                                                </label>
                                                <div className="mt-1">
                                                    <PasswordInput
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        placeholder="••••••••"
                                                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                                    />
                                                </div>
                                                {errors.password && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.password}</p>}
                                            </div>
                                        </div>

                                        {/* Right Column: Academic & Status */}
                                        <div className="space-y-4 bg-slate-50/60 dark:bg-slate-800/40 p-4.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4F6DF5] dark:text-indigo-400 flex items-center gap-1.5">
                                                <GraduationCap className="w-3.5 h-3.5" /> 2. Academic Enrollment
                                            </h3>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Program / Course <span className="text-rose-500">*</span></label>
                                                <select
                                                    value={data.program}
                                                    onChange={(e) => setData('program', e.target.value)}
                                                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-semibold"
                                                    required
                                                >
                                                    {programs.length === 0 ? (
                                                        <option value="">No programs configured</option>
                                                    ) : (
                                                        programs.map((prog) => (
                                                            <option key={prog.id} value={prog.code}>
                                                                {prog.code} - {prog.name}
                                                            </option>
                                                        ))
                                                    )}
                                                    {data.program && !programs.some((p) => p.code === data.program) && (
                                                        <option value={data.program}>{data.program}</option>
                                                    )}
                                                </select>
                                                {errors.program && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.program}</p>}
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Semester <span className="text-rose-500">*</span></label>
                                                <select
                                                    value={data.semester}
                                                    onChange={(e) => setData('semester', e.target.value)}
                                                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-medium"
                                                    required
                                                >
                                                    <option value="1st Semester">1st Semester</option>
                                                    <option value="2nd Semester">2nd Semester</option>
                                                    <option value="Summer">Summer</option>
                                                </select>
                                                {errors.semester && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.semester}</p>}
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Grade Level <span className="text-rose-500">*</span></label>
                                                <select
                                                    value={data.grade_level}
                                                    onChange={(e) => setData('grade_level', e.target.value)}
                                                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-medium"
                                                    required
                                                >
                                                    <option value="1st Year">1st Year</option>
                                                    <option value="2nd Year">2nd Year</option>
                                                    <option value="3rd Year">3rd Year</option>
                                                    <option value="4th Year">4th Year</option>
                                                </select>
                                                {errors.grade_level && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.grade_level}</p>}
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Section <span className="text-rose-500">*</span></label>
                                                <select
                                                    value={data.section}
                                                    onChange={(e) => setData('section', e.target.value)}
                                                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-medium"
                                                    required
                                                >
                                                    {sections.length === 0 ? (
                                                        <option value="">No sections available</option>
                                                    ) : (
                                                        sections.map((sec) => (
                                                            <option key={sec.id} value={sec.section_name}>
                                                                {sec.section_name} {sec.grade_level ? `(${sec.grade_level})` : ''}
                                                            </option>
                                                        ))
                                                    )}
                                                    {data.section && !sections.some((s) => s.section_name === data.section) && (
                                                        <option value={data.section}>{data.section}</option>
                                                    )}
                                                </select>
                                                {errors.section && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.section}</p>}
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">School Year <span className="text-rose-500">*</span></label>
                                                <Input
                                                    value={data.school_year}
                                                    onChange={(e) => setData('school_year', e.target.value)}
                                                    placeholder="2026-2027"
                                                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mt-1 font-mono text-xs"
                                                    required
                                                />
                                                {errors.school_year && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.school_year}</p>}
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Academic Status</label>
                                                <select
                                                    value={data.status}
                                                    onChange={(e) => setData('status', e.target.value)}
                                                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md p-2 mt-1 font-medium"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                                {errors.status && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.status}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Pinned Footer Action Bar */}
                                <div className="px-6 py-4 md:px-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2 rounded-xl text-slate-700 dark:text-slate-300 font-medium text-xs"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition-all text-xs"
                                    >
                                        {editingStudent ? 'Update Student Record' : 'Create Student Record'}
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
