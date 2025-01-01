import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: Toast[] = [];
  constructor() { }


	show(toast: Toast) {
		this.toasts.push(toast);
	}

  showSuccess(message: string) {
    this.toasts.push({ message: message, classname: 'bg-success text-light', autohide: true });
  }

  showError(message: string) {
    this.toasts.push({ message: message, classname: 'bg-danger text-light', autohide: true });
  }

  showWarning(message: string) {
    this.toasts.push({ message: message, classname: 'bg-warning text-light', autohide: true });
  }

  showInfo(message: string) {
    this.toasts.push({ message: message, classname: 'bg-info text-light', autohide: true });
  }

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}

export interface Toast {
	template?: TemplateRef<any>;
  message?: string;
	classname?: string;
	delay?: number;
  autohide: boolean;
}