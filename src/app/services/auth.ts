// src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'; // Import BehaviorSubject

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersStorageKey = 'rick-morty-users';
  private sessionKey = 'rick-morty-session-email';

  // A BehaviorSubject holds the current value and notifies subscribers of changes.
  // We'll store the current user's email (or null if logged out).
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  
  // We expose this as an Observable so other components can subscribe to it.
  public currentUser$: Observable<string | null> = this.currentUserSubject.asObservable();

  constructor() {
    // When the service starts, check if a session already exists in localStorage
    const loggedInEmail = localStorage.getItem(this.sessionKey);
    if (loggedInEmail) {
      this.currentUserSubject.next(loggedInEmail);
    }
  }

  // --- Helper Methods ---

  private getUsers(): any[] {
    // Note: In a real app, this would be an API call and you'd use a User interface
    const users = localStorage.getItem(this.usersStorageKey);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
  }

  // --- Public API Methods ---

  /**
   * Checks if a user is currently logged in.
   * This is the method our AuthGuard needs. It fixes the error.
   */
  public isLoggedIn(): boolean {
    // We just check the current value of our BehaviorSubject
    return this.currentUserSubject.value !== null;
  }

  /**
   * Gets the email of the currently logged-in user.
   */
  public getCurrentUserEmail(): string | null {
    return this.currentUserSubject.value;
  }

  /**
   * (Mock) Registers a new user.
   * Returns an object with success status and a message.
   */
  register(email: string, pass: string): { success: boolean, message: string } {
    const users = this.getUsers();
    // Check if email is already taken
    const userExists = users.find(u => u.email === email);

    if (userExists) {
      return { success: false, message: 'User with this email already exists.' };
    }

    // Add new user (in a real app, you would hash the password!)
    users.push({ email: email, pass: pass });
    this.saveUsers(users);
    
    return { success: true, message: 'Registration successful! You can now log in.' };
  }

  /**
   * (Mock) Logs in a user.
   * Returns an object with success status and a message.
   */
  login(email: string, pass: string): { success: boolean, message: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    if (user.pass !== pass) { // Simple text comparison (this is the "dummy" part)
      return { success: false, message: 'Incorrect password.' };
    }

    // Login successful!
    // 1. Save session to localStorage
    localStorage.setItem(this.sessionKey, user.email);
    // 2. Notify all subscribers (like the header) that the user has changed
    this.currentUserSubject.next(user.email);

    return { success: true, message: 'Login successful!' };
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    // 1. Remove session from localStorage
    localStorage.removeItem(this.sessionKey);
    // 2. Notify all subscribers
    this.currentUserSubject.next(null);
  }
}