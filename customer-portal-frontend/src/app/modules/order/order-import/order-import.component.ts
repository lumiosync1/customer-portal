import { Component, inject } from '@angular/core';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { AuthService } from '../../auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-import',
  standalone: true,
  imports: [UploaderModule],
  templateUrl: './order-import.component.html',
  styleUrl: './order-import.component.scss'
})
export class OrderImportComponent {
  private authService = inject(AuthService);
  
  public path: Object = {
    saveUrl: `${environment.apiUrl}/api/orders/import`,
    removeUrl: `${environment.apiUrl}/api/orders/import`
  };

  onFileUploading(args: any): void {
    // Add JWT to request header before file upload
    const token = this.authService.getAuthFromLocalStorage()?.AccessToken;
    args.currentRequest.setRequestHeader('Authorization',`Bearer ${token}`);
  }
}
