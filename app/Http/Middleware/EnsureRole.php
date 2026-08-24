<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $hasRole = false;
        if ($role === 'instructor' || $role === 'professor') {
            $hasRole = $user->isInstructor();
        } else {
            $hasRole = $user->role === $role;
        }

        if (!$hasRole) {
            abort(403, 'You are not authorized to access this page.');
        }

        if ($user->status !== 'Active') {
            abort(403, 'Account is inactive. Please contact the system administrator.');
        }

        return $next($request);
    }
}
