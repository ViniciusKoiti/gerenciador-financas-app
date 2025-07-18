import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { CustomButtonComponent } from '../../shared/components/custom-buttom/custom-buttom.component';
import { AuthService } from '../../shared/services/auth.service';
import { ILoginRequest } from '../../requests/login.request';
import { ISignupRequest } from '../../requests/signup.request';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '@app/routes.constantes';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    CustomButtonComponent,
    FormFieldComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  hideSignupForm: boolean = false;
  isTransitioning: boolean = false;

  isSaving: boolean = false;
  isMobile = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initializeForms();
    this.checkScreenSize();
    this.checkAuthAndRedirect();
  }

  initializeForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signupForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 1024;
  }

  private checkAuthAndRedirect(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([ROUTE_PATHS.DASHBOARD]);
    }
  }



  onSignup() {
    this.isSaving = true;
    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    const signupForm: ISignupRequest = this.signupForm.value;
    this.authService.signup(signupForm).subscribe({
      next: (response) => {
        this.router.navigate(['app/dashboard'])
      },
      error: (error) => {
        console.error('Request failed', error);
      },
      complete: () => {
        this.isSaving = false;
      }
    })
  }

  onLogin() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const loginData: ILoginRequest = this.loginForm.value;
    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.router.navigate([ROUTE_PATHS.DASHBOARD]);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  toggleMode() {
    this.isTransitioning = true;

    setTimeout(() => {
      this.hideSignupForm = !this.hideSignupForm;

      setTimeout(() => {
        this.isTransitioning = false;
      }, 300);
    }, 150);
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('senha') as FormControl;
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get nameSignupControl(): FormControl {
    return this.signupForm.get('nome') as FormControl;
  }

  get emailSignupControl(): FormControl {
    return this.signupForm.get('email') as FormControl;
  }

  get passwordSignupControl(): FormControl {
    return this.signupForm.get('senha') as FormControl;
  }

  get password() {
    return this.loginForm.get('senha');
  }
}
