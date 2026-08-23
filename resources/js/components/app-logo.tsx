import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#4F6DF5] text-white shadow-sm transition-colors dark:bg-[#4058D6]">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                    {name || 'Laravel'}
                </span>
                <span className="truncate text-[10px] font-semibold text-[#4F6DF5] dark:text-indigo-400 uppercase tracking-widest mt-0.5">
                    GRADE ADMIN
                </span>
            </div>
        </>
    );
}
