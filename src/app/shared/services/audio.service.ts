import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;

  playAudio(path: string): void {
    this.stopAudio();

    this.audio = new Audio(path);
    this.audio.play().catch(error => console.error('Erro ao reproduzir áudio:', error));
  }

  pauseAudio(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  stopAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null; // Libera o recurso
    }
  }
}
