import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';

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
    FormFieldComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;
  hideLoginForm: boolean = false;
  hideSignupForm: boolean = false;
  isTransitioning: boolean = false;
  hideLoginPassword: boolean = false;
  hideSignupPassword: boolean = false;

  constructor(private fb: FormBuilder) {
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

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
  }

  onSignup(){

  }
  onLogin(){

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
}
