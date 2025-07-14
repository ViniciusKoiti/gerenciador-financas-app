// src/app/shared/services/notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = new BehaviorSubject<NotificationMessage[]>([]);

  public notifications$ = this._notifications.asObservable();

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration = 3000): void {
    this.showNotification({
      type: 'success',
      message,
      duration
    });
  }

  showError(message: string, duration = 5000): void {
    this.showNotification({
      type: 'error',
      message,
      duration
    });
  }

  showWarning(message: string, duration = 4000): void {
    this.showNotification({
      type: 'warning',
      message,
      duration
    });
  }

  showInfo(message: string, duration = 3000): void {
    this.showNotification({
      type: 'info',
      message,
      duration
    });
  }

  private showNotification(options: Omit<NotificationMessage, 'id' | 'timestamp'>): void {
    const notification: NotificationMessage = {
      id: this.generateId(),
      timestamp: new Date(),
      ...options
    };

    const current = this._notifications.value;
    this._notifications.next([...current, notification]);

    const snackBarRef = this.snackBar.open(
      notification.message,
      'Fechar',
      {
        duration: notification.duration,
        panelClass: [`snack-${notification.type}`],
        horizontalPosition: 'end',
        verticalPosition: 'top'
      }
    );

    snackBarRef.afterDismissed().subscribe(() => {
      this.removeNotification(notification.id);
    });
  }

  private removeNotification(id: string): void {
    const current = this._notifications.value;
    const updated = current.filter(n => n.id !== id);
    this._notifications.next(updated);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  clear(): void {
    this._notifications.next([]);
  }
}
