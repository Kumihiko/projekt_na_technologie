// src/app/services/auth-check.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth'; // Importujemy nasz SERWIS

export const authCheckGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Sprawdzamy, czy serwis mówi, że jesteśmy zalogowani
  if (authService.isLoggedIn()) {
    return true; // OK, wpuść użytkownika
  } else {
    // Nie jest zalogowany. Przekieruj do /login
    router.navigate(['/login']);
    return false; // Zablokuj dostęp
  }
};