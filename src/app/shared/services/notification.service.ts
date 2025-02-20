import {Directive, inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {AudioService} from '@shared/services/audio.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService{

  private snackbar = inject(MatSnackBar);
  private audioService = inject(AudioService);

  error(messagem: string = "Erro Interno"){
    const config: MatSnackBarConfig = {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['error-snackbar']
    };
    this.audioService.playAudio("../assets/songs/error-notification.mp3");
    this.snackbar.open(messagem, "X", config);

  }
}
