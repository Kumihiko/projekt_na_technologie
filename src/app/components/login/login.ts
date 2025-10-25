// src/app/components/login/login.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup and Validators
import { Router, RouterLink } from '@angular/router'; // Import Router and RouterLink
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  // Make sure RouterLink is also in imports
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit { // Implement OnInit

  loginForm!: FormGroup; // Add ! to tell TypeScript it will be initialized
  errorMessage: string | null = null;

  // Inject FormBuilder, AuthService, and Router
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.loginForm = this.fb.group({
      // '' is the default value
      // [Validators.required, Validators.email] are the rules
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Helper getter for easy access to form controls in the template
  get f() {
    return this.loginForm.controls;
  }

  // This method is called when the form is submitted
  onSubmit(): void {
    this.errorMessage = null; // Reset error message

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      // Mark all fields as 'touched' to display error messages
      this.loginForm.markAllAsTouched(); 
      return;
    }

    // Get values from the form using BRACKET NOTATION
    const email = this.f['email'].value;       // <-- POPRAWKA TUTAJ
    const password = this.f['password'].value; // <-- POPRAWKA TUTAJ

    // Try to log in using our service
    const response = this.auth.login(email, password);

    if (response.success) {
      // On success, navigate to the favorites page
      this.router.navigate(['/favorites']);
    } else {
      // On failure, show the error message from the service
      this.errorMessage = response.message;
    }
  }
  }
