import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const hostGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.payload?.companyId === environment.hostCompanyId || router.parseUrl('/login');
};
