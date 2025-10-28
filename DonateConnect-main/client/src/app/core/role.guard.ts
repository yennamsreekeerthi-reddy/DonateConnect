import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getUser();
  
  // If not logged in, redirect to login
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  
  // Get required roles from route data
  const requiredRoles = route.data['roles'] as string[];
  
  // If no specific roles required, just check if logged in
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  // Check if user has required role
  if (requiredRoles.includes(user.role)) {
    return true;
  }
  
  // User doesn't have required role, redirect to appropriate dashboard
  switch (user.role) {
    case 'DONOR':
      router.navigate(['/donor']);
      break;
    case 'NGO':
      router.navigate(['/ngo']);
      break;
    case 'ADMIN':
      router.navigate(['/admin']);
      break;
    default:
      router.navigate(['/']);
  }
  
  return false;
};
