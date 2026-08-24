import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    UserCheck,
    BookOpen,
    Layers,
    UserPlus,
    FileSpreadsheet,
    Trophy,
    History,
    RefreshCw,
    ShieldAlert,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, SharedData } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const role = auth?.user?.role;
    const isInstructor = role === 'instructor' || role === 'professor';
    const isStudent = role === 'student';

    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Students',
            href: '/admin/students',
            icon: Users,
        },
        {
            title: 'Instructors',
            href: '/admin/instructors',
            icon: UserCheck,
        },
        {
            title: 'Subjects',
            href: '/admin/subjects',
            icon: BookOpen,
        },
        {
            title: 'Sections',
            href: '/admin/sections',
            icon: Layers,
        },
        {
            title: 'Assignments',
            href: '/admin/assignments',
            icon: UserPlus,
        },
        {
            title: 'Submission Controls',
            href: '/admin/submission-control',
            icon: ShieldAlert,
        },
        {
            title: 'Grades',
            href: '/admin/grades',
            icon: FileSpreadsheet,
        },
        {
            title: 'Rankings',
            href: '/admin/rankings',
            icon: Trophy,
        },
        {
            title: 'Audit Logs',
            href: '/admin/audit-logs',
            icon: History,
        },
        {
            title: 'Data Sync',
            href: '/settings/sync',
            icon: RefreshCw,
        },
    ];


    const instructorNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/instructor/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'My Classes',
            href: '/instructor/classes',
            icon: FileSpreadsheet,
        },
        {
            title: 'Audit Activity',
            href: '/instructor/audit-activity',
            icon: History,
        },
    ];

    const studentNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/student/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'My Subjects',
            href: '/student/subjects',
            icon: BookOpen,
        },
        {
            title: 'My Grades',
            href: '/student/grades',
            icon: FileSpreadsheet,
        },
        {
            title: 'My Ranking',
            href: '/student/ranking',
            icon: Trophy,
        },
    ];

    let mainNavItems = adminNavItems;
    let logoHref = '/admin/dashboard';

    if (isStudent) {
        mainNavItems = studentNavItems;
        logoHref = '/student/dashboard';
    } else if (isInstructor) {
        mainNavItems = instructorNavItems;
        logoHref = '/instructor/dashboard';
    }

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={logoHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
