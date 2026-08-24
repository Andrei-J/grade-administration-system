import { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, Edit, UserPlus, X, CheckCircle2, AlertCircle, Layers, Trash2 } from 'lucide-react';
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

interface Student {
    id: number;
    student_id: string;
    name: string;
    section: string;
    grade_level: string;
}

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Props {
    assignments: Assignment[];
    instructors: Instructor[];
    subjects: Subject[];
    sections: Section[];
    students?: Student[];
}

interface SectionPairing {
    section_id: string;
    subject_ids: string[];
}

interface GroupedAssignment {
    instructor_id: string;
    instructor_name: string;
    school_year: string;
    status: string;
    sections: string[];
    subjects: Array<{ code: string; name: string }>;
    assignments: Assignment[];
}

export default function AssignmentManagement({
    assignments,
    instructors,
    subjects,
    sections,
    students = [],
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isIrregularModalOpen, setIsIrregularModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { flash } = usePage().props as PageProps;

    const [instructorId, setInstructorId] = useState<string>(instructors[0]?.instructor_id || '');
    const [pairings, setPairings] = useState<SectionPairing[]>([
        {
            section_id: sections[0]?.section_name || '',
            subject_ids: [],
        },
    ]);
    const [schoolYear, setSchoolYear] = useState<string>('2026-2027');
    const [status, setStatus] = useState<string>('Active');

    const irregularForm = useForm({
        student_id: students[0]?.student_id || '',
        subject_id: subjects[0]?.subject_code || '',
        instructor_id: instructors[0]?.instructor_id || '',
        section_id: sections[0]?.section_name || '',
        school_year: '2026-2027',
    });

    // Dynamic grouping of assignments by instructor and school year
    const groupedAssignments: GroupedAssignment[] = Object.values(
        assignments.reduce((acc, asgn) => {
            const key = `${asgn.instructor_id}_${asgn.school_year}`;
            if (!acc[key]) {
                acc[key] = {
                    instructor_id: asgn.instructor_id,
                    instructor_name: asgn.instructor?.name || asgn.instructor_id,
                    school_year: asgn.school_year,
                    status: asgn.status,
                    sections: [],
                    subjectsMap: {},
                    assignments: [],
                };
            }
            if (!acc[key].sections.includes(asgn.section_id)) {
                acc[key].sections.push(asgn.section_id);
            }
            if (!acc[key].subjectsMap[asgn.subject_id]) {
                acc[key].subjectsMap[asgn.subject_id] = asgn.subject?.subject_name || '';
            }
            acc[key].assignments.push(asgn);
            return acc;
        }, {} as Record<string, any>)
    ).map((group: any) => ({
        instructor_id: group.instructor_id,
        instructor_name: group.instructor_name,
        school_year: group.school_year,
        status: group.status,
        sections: group.sections,
        subjects: Object.keys(group.subjectsMap).map((code) => ({
            code,
            name: group.subjectsMap[code],
        })),
        assignments: group.assignments,
    }));

    const openCreateModal = () => {
        setEditingAssignment(null);
        setInstructorId(instructors[0]?.instructor_id || '');
        const initialSec = sections[0]?.section_name || '';
        setPairings([
            {
                section_id: initialSec,
                subject_ids: subjects.length > 0 ? [subjects[0].subject_code] : [],
            },
        ]);
        setSchoolYear('2026-2027');
        setStatus('Active');
        setIsModalOpen(true);
    };

    const openEditModalForGroup = (group: GroupedAssignment) => {
        setEditingAssignment(group.assignments[0] || null);
        setInstructorId(group.instructor_id);

        const sectionMap: Record<string, string[]> = {};
        group.assignments.forEach((asgn) => {
            if (!sectionMap[asgn.section_id]) {
                sectionMap[asgn.section_id] = [];
            }
            if (!sectionMap[asgn.section_id].includes(asgn.subject_id)) {
                sectionMap[asgn.section_id].push(asgn.subject_id);
            }
        });

        const newPairings: SectionPairing[] = Object.keys(sectionMap).map((secId) => ({
            section_id: secId,
            subject_ids: sectionMap[secId],
        }));

        setPairings(newPairings.length > 0 ? newPairings : [{ section_id: sections[0]?.section_name || '', subject_ids: [] }]);
        setSchoolYear(group.school_year);
        setStatus(group.status);
        setIsModalOpen(true);
    };

    const openIrregularModal = () => {
        const firstPair = pairings[0];
        irregularForm.setData({
            student_id: students[0]?.student_id || '',
            subject_id: (firstPair?.subject_ids && firstPair.subject_ids[0]) || subjects[0]?.subject_code || '',
            instructor_id: instructorId || instructors[0]?.instructor_id || '',
            section_id: firstPair?.section_id || sections[0]?.section_name || '',
            school_year: schoolYear || '2026-2027',
        });
        setIsIrregularModalOpen(true);
    };

    const handleSectionChange = (index: number, newSectionId: string) => {
        setPairings((prev) => {
            return prev.map((pair, pIdx) => {
                if (pIdx !== index) return pair;
                return {
                    section_id: newSectionId,
                    subject_ids: subjects.length > 0 ? [subjects[0].subject_code] : [],
                };
            });
        });
    };

    const toggleSubjectForPairing = (index: number, subjectCode: string) => {
        setPairings((prev) => {
            return prev.map((pair, pIdx) => {
                if (pIdx !== index) return pair;
                const currentSubs = pair.subject_ids || [];
                const isChecked = currentSubs.includes(subjectCode);
                const newSubs = isChecked
                    ? currentSubs.filter((c) => c !== subjectCode)
                    : [...currentSubs, subjectCode];

                return {
                    ...pair,
                    subject_ids: newSubs,
                };
            });
        });
    };

    const selectAllSubjectsForPairing = (index: number) => {
        setPairings((prev) => {
            return prev.map((pair, pIdx) => {
                if (pIdx !== index) return pair;
                return {
                    ...pair,
                    subject_ids: subjects.map((s) => s.subject_code),
                };
            });
        });
    };

    const deselectAllSubjectsForPairing = (index: number) => {
        setPairings((prev) => {
            return prev.map((pair, pIdx) => {
                if (pIdx !== index) return pair;
                return {
                    ...pair,
                    subject_ids: [],
                };
            });
        });
    };

    const addPairingRow = () => {
        const usedSections = pairings.map((p) => p.section_id);
        const unusedSection = sections.find((s) => !usedSections.includes(s.section_name)) || sections[0];
        const secName = unusedSection?.section_name || '';

        setPairings((prev) => [
            ...prev,
            {
                section_id: secName,
                subject_ids: subjects.length > 0 ? [subjects[0].subject_code] : [],
            },
        ]);
    };

    const removePairingRow = (index: number) => {
        if (pairings.length <= 1) return;
        setPairings((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            '/admin/assignments',
            {
                instructor_id: instructorId,
                pairings: pairings,
                school_year: schoolYear,
                status: status,
            },
            {
                onSuccess: (page) => {
                    setIsSubmitting(false);
                    const pageProps = page.props as PageProps;
                    if (!pageProps.flash?.error) {
                        setIsModalOpen(false);
                    }
                },
                onError: () => setIsSubmitting(false),
            }
        );
    };

    const handleIrregularSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        irregularForm.post('/admin/assignments/irregular-student', {
            onSuccess: (page) => {
                const pageProps = page.props as PageProps;
                if (!pageProps.flash?.error) {
                    setIsIrregularModalOpen(false);
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Class Assignments" />

            <div className="p-4 md:p-6 space-y-6 w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Instructor Class Assignments</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Assign instructors to sections and subjects with aggregated single-row views per instructor.
                        </p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-[#4F6DF5] hover:bg-[#4058D6] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white flex items-center gap-2 font-semibold">
                        <Plus className="w-4 h-4" />
                        Assign Instructor
                    </Button>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && !isModalOpen && !isIrregularModalOpen && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Aggregated Class Assignments Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-medium text-xs uppercase tracking-wider">
                                        <th className="p-3">Instructor</th>
                                        <th className="p-3">Section(s)</th>
                                        <th className="p-3">Subject Code(s)</th>
                                        <th className="p-3">School Year</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {groupedAssignments.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                No instructor assignments recorded. Click "Assign Instructor" to link faculty to classes.
                                            </td>
                                        </tr>
                                    ) : (
                                        groupedAssignments.map((group) => (
                                            <tr key={`${group.instructor_id}_${group.school_year}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                <td className="p-3 font-medium text-slate-900 dark:text-white">
                                                    <p className="font-bold text-slate-900 dark:text-white">{group.instructor_name}</p>
                                                </td>
                                                <td className="p-3 text-slate-900 dark:text-white font-semibold">
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                                        {group.sections.join(' | ')}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {group.subjects.map((sub) => (
                                                            <span
                                                                key={sub.code}
                                                                title={sub.name ? `${sub.code} — ${sub.name}` : sub.code}
                                                                className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-xs cursor-help border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                                                            >
                                                                {sub.code}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">{group.school_year}</td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            group.status === 'Active'
                                                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        {group.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditModalForGroup(group)}>
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

                {/* Assign Instructor Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h2 className="text-xl font-bold">{editingAssignment ? 'Edit Assignment' : 'Assign Instructor'}</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Select Instructor Dropdown */}
                                <div>
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Instructor</label>
                                    <select
                                        value={instructorId}
                                        onChange={(e) => setInstructorId(e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-[#4F6DF5]"
                                        required
                                    >
                                        {instructors.map((i) => (
                                            <option key={i.instructor_id} value={i.instructor_id}>
                                                {i.name} ({i.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Section & Subject Pairings */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                            <Layers className="w-4 h-4 text-[#4F6DF5]" />
                                            <span>Section & Subject Selection</span>
                                            <span className="text-[11px] font-normal text-slate-400">(Section → Subject)</span>
                                        </div>
                                    </div>

                                    {pairings.map((pair, pIdx) => (
                                        <div key={pIdx} className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 relative">
                                            {pairings.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removePairingRow(pIdx)}
                                                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* Select Section */}
                                            <div>
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                    <span className="w-4 h-4 rounded-full bg-[#4F6DF5] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                                                    Select Section
                                                </label>
                                                <select
                                                    value={pair.section_id}
                                                    onChange={(e) => handleSectionChange(pIdx, e.target.value)}
                                                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 mt-1 font-semibold focus:ring-2 focus:ring-[#4F6DF5]"
                                                    required
                                                >
                                                    {sections.map((sec, idx) => (
                                                        <option key={idx} value={sec.section_name}>
                                                            {sec.grade_level} — Section {sec.section_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Select Subject(s) for Selected Section */}
                                            <div className="space-y-1.5 pt-1">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                        <span className="w-4 h-4 rounded-full bg-[#4F6DF5] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                                                        Select Subject(s) for Section: <span className="text-[#4F6DF5] font-semibold">{pair.section_id}</span>
                                                    </label>
                                                    {subjects.length > 0 && (
                                                        <div className="flex items-center gap-2 text-[11px]">
                                                            <button
                                                                type="button"
                                                                onClick={() => selectAllSubjectsForPairing(pIdx)}
                                                                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                                                            >
                                                                Select All
                                                            </button>
                                                            <span className="text-slate-300 dark:text-slate-700">|</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => deselectAllSubjectsForPairing(pIdx)}
                                                                className="text-slate-500 hover:underline"
                                                            >
                                                                Clear
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 bg-white dark:bg-slate-900 space-y-2">
                                                    {subjects.length === 0 ? (
                                                        <div className="p-3 text-center text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-medium">
                                                            No subjects are currently available in the system.
                                                        </div>
                                                    ) : (
                                                        subjects.map((s) => {
                                                            const isChecked = pair.subject_ids.includes(s.subject_code);
                                                            return (
                                                                <div
                                                                    key={s.subject_code}
                                                                    onClick={() => toggleSubjectForPairing(pIdx, s.subject_code)}
                                                                    className={`flex items-center gap-2.5 p-2 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                                                                        isChecked
                                                                            ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 font-semibold'
                                                                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        name={`subject_selection_${pIdx}`}
                                                                        checked={isChecked}
                                                                        readOnly
                                                                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 pointer-events-none"
                                                                    />
                                                                    <span className="font-mono font-bold">{s.subject_code}</span>
                                                                    <span className="text-slate-500 dark:text-slate-400">— {s.subject_name}</span>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addPairingRow}
                                        className="w-full text-xs font-semibold border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all"
                                    >
                                        <Plus className="w-4 h-4 text-[#4F6DF5]" />
                                        + Add Another Section Assignment
                                    </Button>

                                    {/* Custom Irregular Student Button */}
                                    <div className="pt-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={openIrregularModal}
                                            className="w-full text-xs font-semibold border-dashed border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all"
                                        >
                                            <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                            + Custom Add Student (Irregular Student from Different Section)
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">School Year</label>
                                    <input
                                        type="text"
                                        value={schoolYear}
                                        onChange={(e) => setSchoolYear(e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 mt-1"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || pairings.some((p) => p.subject_ids.length === 0)}
                                        className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white font-semibold rounded-lg"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Assignment(s)'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Custom Add Irregular Student Modal */}
                {isIrregularModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Irregular Student</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Enroll student from a different section to this subject</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsIrregularModalOpen(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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

                            <form onSubmit={handleIrregularSubmit} className="space-y-4">
                                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 rounded-xl space-y-1 text-xs">
                                    <p className="text-blue-900 dark:text-blue-200 font-semibold">Class Target Details:</p>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        Subject: <span className="font-bold text-slate-900 dark:text-white font-mono">{irregularForm.data.subject_id}</span>
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        Target Section: <span className="font-bold text-slate-900 dark:text-white">{irregularForm.data.section_id}</span>
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Select Student (From Any Section) <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={irregularForm.data.student_id}
                                        onChange={(e) => irregularForm.setData('student_id', e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 mt-1"
                                        required
                                    >
                                        {students.length === 0 ? (
                                            <option value="">No students available</option>
                                        ) : (
                                            students.map((st) => (
                                                <option key={st.student_id} value={st.student_id}>
                                                    {st.name} ({st.student_id}) — Current Section: {st.section} ({st.grade_level})
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    {irregularForm.errors.student_id && (
                                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{irregularForm.errors.student_id}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Subject Code
                                    </label>
                                    <select
                                        value={irregularForm.data.subject_id}
                                        onChange={(e) => irregularForm.setData('subject_id', e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 mt-1"
                                        required
                                    >
                                        {subjects.map((s) => (
                                            <option key={s.subject_code} value={s.subject_code}>
                                                {s.subject_code} — {s.subject_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsIrregularModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={irregularForm.processing || !irregularForm.data.student_id}
                                        className="bg-[#4F6DF5] hover:bg-[#4058D6] text-white font-semibold rounded-xl"
                                    >
                                        Enroll Irregular Student
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
