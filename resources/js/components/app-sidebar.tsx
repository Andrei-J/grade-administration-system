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
    const isInstructor = auth?.user?.role === 'instructor';

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

    const mainNavItems = isInstructor ? instructorNavItems : adminNavItems;

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isInstructor ? '/instructor/dashboard' : '/admin/dashboard'} prefetch>
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
