// src/app/components/register/register.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import 'AbstractControl' and 'ValidationErrors' for custom validator
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Import Router and RouterLink
import { AuthService } from '../../services/auth';

// Custom Validator Function
function passwordMismatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  
  // If passwords don't match, return an error object
  return (password === confirmPassword) ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink], // Add RouterLink
  templateUrl: './register.html', // Make sure this matches your file name
  styleUrl: './register.css' // Make sure this matches your file name
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // Add password length validation
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      // Add the custom validator to the whole form group
      validators: passwordMismatch
    });
  }

  // Helper getter for form controls
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Use bracket notation to avoid TS4111
    const email = this.f['email'].value;
    const password = this.f['password'].value;

    const response = this.auth.register(email, password);

    if (response.success) {
      this.successMessage = response.message;
      // Clear form on success
      this.registerForm.reset();
      
      // Optional: redirect to login after a short delay
      // setTimeout(() => {
      //   this.router.navigate(['/login']);
      // }, 2000);
    } else {
      this.errorMessage = response.message;
    }
  }
}