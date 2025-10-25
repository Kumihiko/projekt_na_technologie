// src/app/app.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // Import Router
import { Observable } from 'rxjs'; // Import Observable
import { AuthService } from './services/auth'; // Import AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'projekt_na_technologie';

  // This will hold an Observable of the user's login status
  public currentUserEmail$: Observable<string | null> | null = null;

  // Inject AuthService and Router
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the auth service's observable
    this.currentUserEmail$ = this.auth.currentUser$;
  }

  // Logout method
  logout(): void {
    this.auth.logout();
    // After logout, redirect to the login page
    this.router.navigate(['/login']);
  }
}