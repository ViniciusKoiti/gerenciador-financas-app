import {Directive, inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService{

  snackbar = inject(MatSnackBar);

  error(messagem: string = "Erro Interno"){
    const config: MatSnackBarConfig = {
      duration: 100000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['error-snackbar']
    };
    this.snackbar.open(messagem, "X", config);
  }
}
