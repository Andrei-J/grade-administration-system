# Graph Report - .  (2026-08-24)

## Corpus Check
- 225 files · ~54,506 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1128 nodes · 2393 edges · 128 communities (86 shown, 42 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Resources Components Delete
- App Http Controllers
- Composer Scripts
- Resources App
- App Http Controllers
- Resources Components App
- Resources Components App
- Resources Components Badge
- Resources Components Two
- App Http Controllers
- Resources Components Nav
- App Http Controllers
- App Http Controllers
- App Models User
- Ref Resources
- Resources Components App
- App Http Controllers
- Resources Components Placeholder
- App Http Controllers
- App Models Adminauditlog
- Components
- Babel Plugin React
- App Http Controllers
- App Http Middleware
- App Models User
- App Providers Appserviceprovider
- Laravel Multiplex
- App Actions Fortify
- App Models Assignment
- Resources Components App
- App Actions Fortify
- Composer
- Composer Require Dev
- Resources Components Card
- App Http Controllers
- Composer Require
- Resources Components Breadcrumbs
- Resources Pages Admin
- Class Variance Authority
- Composer Allow Plugins
- Package Scripts
- Resources Pages Student
- Database Factories Userfactory
- Resources Components Alert
- Resources Components Toggle
- Resources Pages Admin
- Resources Pages Instructor
- Resources Pages Student
- Illuminate Foundation Testing
- Resources Components Sidebar
- Resources Pages Admin
- Resources Pages Admin
- Resources Pages Admin
- Resources Pages Admin
- Resources Pages Student
- Resources Pages Student
- Composer Autoload
- Composer Extra
- App Http Requests
- Database Seeders Databaseseeder
- Package
- Composer Keywords
- Eslint Config
- Resources Components Icon
- Concurrently
- Eslint Import Resolver
- Eslint Plugin Import
- Eslint Plugin React
- Eslint Plugin React
- Globals
- Inertiajs React
- Input Otp
- Laravel Passkeys
- Lucide React
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies Radix
- Package Dependencies React
- Package Dependencies React
- Package Dependencies Sonner
- Package Dependencies Tailwind
- Package Dependencies Tailwindcss
- Package Dependencies Tailwindcss
- Package Dependencies Animate
- Package Dependencies Types
- Package Dependencies Types
- Package Dependencies Typescript
- Package Dependencies Vite
- Package Dependencies Vitejs
- Package Devdependencies Prettier
- Package Devdependencies Prettier

## God Nodes (most connected - your core abstractions)
1. `cn()` - 127 edges
2. `Controller` - 43 edges
3. `SheetSyncService` - 35 edges
4. `User` - 31 edges
5. `SectionRepository` - 31 edges
6. `Button()` - 31 edges
7. `GradeRepository` - 28 edges
8. `StudentRepository` - 27 edges
9. `SubjectRepository` - 25 edges
10. `BreadcrumbItem` - 25 edges

## Surprising Connections (you probably didn't know these)
- `NavFooter()` --calls--> `toUrl()`  [EXTRACTED]
  resources/js/components/nav-footer.tsx → resources/js/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/breadcrumb.tsx → resources/js/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/dialog.tsx → resources/js/lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/dropdown-menu.tsx → resources/js/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/dropdown-menu.tsx → resources/js/lib/utils.ts

## Import Cycles
- None detected.

## Communities (128 total, 42 thin omitted)

### Community 0 - "Resources Components Delete"
Cohesion: 0.05
Nodes (61): DeleteUser(), Heading(), InputError(), ManagePasskeys(), Props, ManageTwoFactor(), Props, PasskeyItem() (+53 more)

### Community 1 - "App Http Controllers"
Cohesion: 0.10
Nodes (9): InstructorController, StudentRegistrationController, Controller, ProfileController, SecurityController, GradeController, Illuminate\Http\RedirectResponse, Illuminate\Http\Request (+1 more)

### Community 2 - "Composer Scripts"
Cohesion: 0.05
Nodes (39): scripts, ci:check, dev, lint, lint:check, post-autoload-dump, post-create-project-cmd, post-root-package-install (+31 more)

### Community 3 - "Resources App"
Cohesion: 0.10
Nodes (24): AppLogo(), AppLogoIcon(), AppearanceToggleTab(), Toaster(), TooltipProvider(), Appearance, applyTheme(), getStoredAppearance() (+16 more)

### Community 4 - "App Http Controllers"
Cohesion: 0.10
Nodes (5): SyncController, GoogleSheetsService, SheetSyncService, Google\Service\Sheets, Sheets

### Community 5 - "Resources Components App"
Cohesion: 0.11
Nodes (29): NavFooter(), NavMain(), NavUser(), Sidebar(), SidebarContent(), SidebarContext, SidebarFooter(), SidebarGroup() (+21 more)

### Community 6 - "Resources Components App"
Cohesion: 0.12
Nodes (21): mainNavItems, Props, rightNavItems, Avatar(), AvatarFallback(), AvatarImage(), Sheet(), SheetContent() (+13 more)

### Community 7 - "Resources Components Badge"
Cohesion: 0.12
Nodes (21): Badge(), badgeVariants, CardFooter(), NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink() (+13 more)

### Community 8 - "Resources Components Two"
Cohesion: 0.13
Nodes (16): Props, Card(), CardDescription(), CardHeader(), CardTitle(), AuditLog, breadcrumbs, Props (+8 more)

### Community 9 - "App Http Controllers"
Cohesion: 0.13
Nodes (5): DashboardController, GradeController, Grade, GradeRepository, GradeService

### Community 10 - "Resources Components Nav"
Cohesion: 0.13
Nodes (16): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+8 more)

### Community 11 - "App Http Controllers"
Cohesion: 0.14
Nodes (5): GradeController, SectionController, StudentController, Section, SectionRepository

### Community 12 - "App Http Controllers"
Cohesion: 0.15
Nodes (5): SubjectController, ClassController, SubjectController, Subject, SubjectRepository

### Community 13 - "App Models User"
Cohesion: 0.15
Nodes (4): User, UserRepository, Illuminate\Foundation\Auth\User, Laravel\Fortify\Contracts\PasskeyUser

### Community 14 - "Ref Resources"
Cohesion: 0.10
Nodes (19): resources/js/**/*.d.ts, resources/js/**/*.ts, resources/js/**/*.tsx, compilerOptions, allowJs, baseUrl, esModuleInterop, forceConsistentCasingInFileNames (+11 more)

### Community 15 - "Resources Components App"
Cohesion: 0.19
Nodes (10): AppContent(), Props, AppShell(), Props, AppSidebar(), AppSidebarHeader(), BreadcrumbItem, AppLayoutProps (+2 more)

### Community 16 - "App Http Controllers"
Cohesion: 0.18
Nodes (4): DashboardController, RankingController, Student, StudentRepository

### Community 17 - "Resources Components Placeholder"
Cohesion: 0.13
Nodes (11): PlaceholderPattern(), PlaceholderPatternProps, AppSidebarLayout(), AppLayout(), breadcrumbs, AuditLog, breadcrumbs, Props (+3 more)

### Community 18 - "App Http Controllers"
Cohesion: 0.17
Nodes (3): AssignmentController, Instructor, InstructorRepository

### Community 19 - "App Models Adminauditlog"
Cohesion: 0.20
Nodes (5): AdminAuditLog, SyncLog, SyncLogRepository, Illuminate\Database\Eloquent\Factories\HasFactory, Illuminate\Database\Eloquent\Model

### Community 20 - "Components"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 21 - "Babel Plugin React"
Cohesion: 0.12
Nodes (17): babel-plugin-react-compiler, eslint-config-prettier, @eslint/js, @laravel/vite-plugin-wayfinder, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-prettier (+9 more)

### Community 22 - "App Http Controllers"
Cohesion: 0.21
Nodes (5): AuditLogController, DashboardController, AuditActivityController, AuditLog, AuditLogRepository

### Community 23 - "App Http Middleware"
Cohesion: 0.19
Nodes (7): EnsureRole, HandleAppearance, HandleInertiaRequests, Closure, Illuminate\Foundation\Configuration\Middleware, Inertia\Middleware, Symfony\Component\HttpFoundation\Response

### Community 24 - "App Models User"
Cohesion: 0.13
Nodes (3): Illuminate\Notifications\Notifiable, Laravel\Fortify\PasskeyAuthenticatable, Laravel\Fortify\TwoFactorAuthenticatable

### Community 25 - "App Providers Appserviceprovider"
Cohesion: 0.20
Nodes (3): AppServiceProvider, FortifyServiceProvider, Illuminate\Support\ServiceProvider

### Community 26 - "Laravel Multiplex"
Cohesion: 0.13
Nodes (15): @laravel/multiplex, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, optionalDependencies, @laravel/multiplex, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu (+7 more)

### Community 27 - "App Actions Fortify"
Cohesion: 0.22
Nodes (5): ResetUserPassword, PasswordUpdateRequest, ProfileDeleteRequest, Illuminate\Foundation\Http\FormRequest, Laravel\Fortify\Contracts\ResetsUserPasswords

### Community 28 - "App Models Assignment"
Cohesion: 0.27
Nodes (3): Assignment, AssignmentRepository, Illuminate\Database\Eloquent\Collection

### Community 29 - "Resources Components App"
Cohesion: 0.24
Nodes (10): AppHeader(), Separator(), IsCurrentOrParentUrlFn, IsCurrentUrlFn, useCurrentUrl(), UseCurrentUrlReturn, WhenCurrentUrlFn, SettingsLayout() (+2 more)

### Community 30 - "App Actions Fortify"
Cohesion: 0.27
Nodes (6): CreateNewUser, emailRules(), nameRules(), profileRules(), ProfileUpdateRequest, Laravel\Fortify\Contracts\CreatesNewUsers

### Community 31 - "Composer"
Cohesion: 0.18
Nodes (10): autoload-dev, psr-4, description, license, minimum-stability, name, prefer-stable, Tests\\ (+2 more)

### Community 32 - "Composer Require Dev"
Cohesion: 0.18
Nodes (11): require-dev, fakerphp/faker, larastan/larastan, laravel/pail, laravel/pao, laravel/pint, laravel/sail, mockery/mockery (+3 more)

### Community 33 - "Resources Components Card"
Cohesion: 0.18
Nodes (7): CardContent(), breadcrumbs, Grade, Props, breadcrumbs, Props, Section

### Community 34 - "App Http Controllers"
Cohesion: 0.31
Nodes (3): RankingController, RankingService, Illuminate\Support\Collection

### Community 35 - "Composer Require"
Cohesion: 0.20
Nodes (10): require, google/apiclient, google/apiclient-services, inertiajs/inertia-laravel, laravel/chisel, laravel/fortify, laravel/framework, laravel/tinker (+2 more)

### Community 36 - "Resources Components Breadcrumbs"
Cohesion: 0.33
Nodes (8): Breadcrumbs(), Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 37 - "Resources Pages Admin"
Cohesion: 0.20
Nodes (8): Assignment, breadcrumbs, Instructor, PageProps, Props, Section, Student, Subject

### Community 38 - "Class Variance Authority"
Cohesion: 0.22
Nodes (9): class-variance-authority, clsx, @inertiajs/vite, laravel-vite-plugin, dependencies, class-variance-authority, clsx, @inertiajs/vite (+1 more)

### Community 39 - "Composer Allow Plugins"
Cohesion: 0.22
Nodes (9): pestphp/pest-plugin, php-http/discovery, block-insecure, config, allow-plugins, audit, optimize-autoloader, preferred-install (+1 more)

### Community 40 - "Package Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, build:ssr, dev, format, format:check, lint, lint:check (+1 more)

### Community 41 - "Resources Pages Student"
Cohesion: 0.25
Nodes (6): AvailableSubject, breadcrumbs, PageProps, Props, StudentInfo, SubjectItem

### Community 42 - "Database Factories Userfactory"
Cohesion: 0.43
Nodes (3): UserFactory, Illuminate\Database\Eloquent\Factories\Factory, static

### Community 43 - "Resources Components Alert"
Cohesion: 0.48
Nodes (5): AlertError(), Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 44 - "Resources Components Toggle"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 45 - "Resources Pages Admin"
Cohesion: 0.29
Nodes (5): breadcrumbs, PageProps, Props, Section, Student

### Community 46 - "Resources Pages Instructor"
Cohesion: 0.29
Nodes (5): Assignment, breadcrumbs, GradeRecord, Props, Student

### Community 47 - "Resources Pages Student"
Cohesion: 0.29
Nodes (5): breadcrumbs, Props, RecentGrade, StudentInfo, Summary

### Community 49 - "Resources Components Sidebar"
Cohesion: 0.53
Nodes (5): SidebarProvider(), getServerSnapshot(), isSmallerThanBreakpoint(), mediaQueryListener(), useIsMobile()

### Community 50 - "Resources Pages Admin"
Cohesion: 0.33
Nodes (4): AdminAuditLog, AuditLog, breadcrumbs, Props

### Community 51 - "Resources Pages Admin"
Cohesion: 0.33
Nodes (4): breadcrumbs, Instructor, PageProps, Props

### Community 52 - "Resources Pages Admin"
Cohesion: 0.33
Nodes (4): breadcrumbs, Props, RankingRow, Section

### Community 53 - "Resources Pages Admin"
Cohesion: 0.33
Nodes (4): breadcrumbs, PageProps, Props, Subject

### Community 54 - "Resources Pages Student"
Cohesion: 0.33
Nodes (4): breadcrumbs, GradeItem, Props, StudentInfo

### Community 55 - "Resources Pages Student"
Cohesion: 0.33
Nodes (4): breadcrumbs, Props, RankingInfo, StudentInfo

### Community 56 - "Composer Autoload"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 57 - "Composer Extra"
Cohesion: 0.40
Nodes (5): extra, laravel, post-create-project, dont-discover, installer

### Community 60 - "Package"
Cohesion: 0.50
Nodes (3): private, $schema, type

### Community 62 - "Composer Keywords"
Cohesion: 0.67
Nodes (3): keywords, framework, laravel

## Knowledge Gaps
- **283 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+278 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Resources Components Badge` to `Resources Components Delete`, `Resources Components Card`, `Resources App`, `Resources Components Breadcrumbs`, `Resources Components App`, `Resources Components App`, `Resources Components Two`, `Resources Components Nav`, `Resources Components Alert`, `Resources Components Toggle`, `Resources Components Sidebar`, `Resources Components App`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `User` connect `App Models User` to `App Http Controllers`, `App Http Controllers`, `Database Seeders Databaseseeder`, `App Models Adminauditlog`, `App Models User`, `App Actions Fortify`, `App Actions Fortify`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Class Variance Authority` to `Package`, `Concurrently`, `Globals`, `Inertiajs React`, `Input Otp`, `Laravel Passkeys`, `Lucide React`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies Radix`, `Package Dependencies React`, `Package Dependencies React`, `Package Dependencies Sonner`, `Package Dependencies Tailwind`, `Package Dependencies Tailwindcss`, `Package Dependencies Tailwindcss`, `Package Dependencies Animate`, `Package Dependencies Types`, `Package Dependencies Types`, `Package Dependencies Typescript`, `Package Dependencies Vite`, `Package Dependencies Vitejs`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _283 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Resources Components Delete` be split into smaller, more focused modules?**
  _Cohesion score 0.05054211843202669 - nodes in this community are weakly interconnected._
- **Should `App Http Controllers` be split into smaller, more focused modules?**
  _Cohesion score 0.10202655485674354 - nodes in this community are weakly interconnected._
- **Should `Composer Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._