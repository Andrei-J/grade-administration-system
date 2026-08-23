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

        if ($user->role !== $role) {
            abort(403, 'Unauthorized. Access restricted to ' . ucfirst($role) . ' role.');
        }

        if ($user->status !== 'Active') {
            abort(403, 'Account is inactive. Please contact the system administrator.');
        }

        return $next($request);
    }
}
