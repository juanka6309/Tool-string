import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ToastMessage {
  constructor(
    private _toastr: ToastrService,
    private _router: Router,
    private _routerNavbar: ActivatedRoute
  ) {}

  /**
   * mostrar mesanje de exito
   */
  public success(message: string, title?: string, route?: string): void {
    const mm = this._toastr.success(message, title || 'Correcto');
    if (route) {
      mm.onTap.subscribe((action) => {
        this._router.navigate([route], {
          relativeTo: this._routerNavbar,
        });
      });
    }
  }

  /**
   * mostrar mensaje de precacion
   */
  public warning(message: string, title?: string, enableHtml?: boolean): void {
    this._toastr.warning(message, title || 'Precaución', {
      enableHtml: enableHtml,
    });
  }

  /**
   * mostrar mensaje de error
   */
  public error(
    message: string,
    enableHtml: boolean = false,
    title?: string
  ): void {
    this._toastr.error(message, title || 'Error', { enableHtml: enableHtml });
  }
}
