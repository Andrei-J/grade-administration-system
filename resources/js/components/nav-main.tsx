import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types';

export function NavMain({
    items,
    groups,
}: {
    items?: NavItem[];
    groups?: NavGroup[];
}) {
    const { isCurrentUrl } = useCurrentUrl();

    const normalizedGroups: NavGroup[] = groups ?? (items ? [{ label: 'Platform', items }] : []);

    return (
        <div className="space-y-4 py-1">
            {normalizedGroups.map((group, idx) => (
                <SidebarGroup key={group.label || idx} className="px-2 py-0">
                    {group.label && <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{group.label}</SidebarGroupLabel>}
                    <SidebarMenu>
                        {group.items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </div>
    );
}
