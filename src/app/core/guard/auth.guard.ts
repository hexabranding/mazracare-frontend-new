// import { inject, Injectable } from '@angular/core';
// import { CanMatchFn,Router } from '@angular/router';

// export const AuthGuard: CanMatchFn = () => {
//   const router=inject(Router)
//   console.log(localStorage.getItem('user'));

//   let user = !!localStorage.getItem('user')
//   if (user) {
//     return true;
//   } else {
//     router.navigate(['/login']);
//     return false;
//   }
// }

import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ Check if code is running in browser
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  const isLoggedIn = !!localStorage.getItem('user');

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
