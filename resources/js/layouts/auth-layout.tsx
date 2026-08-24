export default function AuthLayout({
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    // Login and registration pages manage their own full-screen layout.
    // Other auth pages (forgot-password, reset-password, etc.) wrap
    // themselves in a max-w-sm centered div.
    return <>{children}</>;
}
