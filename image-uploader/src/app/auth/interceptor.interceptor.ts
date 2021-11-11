import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(private loginService: UserServiceService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.get('noAuth')) {
      console.log(request);
      return next.handle(request.clone())
    } else {
      const clonedRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.loginService.getToken()}`
        }
      });
      return next.handle(clonedRequest).pipe(
        tap(
          event => {},
          err => {
            if (err) {
              this.router.navigateByUrl('/login');
            }
          }
        )
      );

    }
  }
}
