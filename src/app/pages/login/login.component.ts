import { Component, OnInit } from '@angular/core';
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
  hideLoginForm: boolean = false;
  hideSignupForm: boolean = false;
  isTransitioning: boolean = false;
  hideLoginPassword: boolean = false;
  hideSignupPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  onSignup() {
    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    const signupForm: ISignupRequest = this.signupForm.value;
    this.authService.signup(signupForm).subscribe({
      next: (response) => {
        console.log('Signup successful', response);
      },
      error: (error) => {
        console.error('Request failed', error);
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
        console.log('Login successful', response);
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
      }, 300); // Metade do tempo da transição para voltar a mostrar
    }, 150); // Tempo 
    // para esconder antes de trocar o texto
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get nameControl(): FormControl {
    return this.signupForm.get('name') as FormControl;
  }

  get emailSignupControl(): FormControl {
    return this.signupForm.get('email') as FormControl;
  }

  get passwordSignupControl(): FormControl {
    return this.signupForm.get('password') as FormControl;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
