import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (localStorage.getItem("token") != null) {
      const cloneReq = request.clone({
        headers: request.headers.set(
          "Authorization",
          "Bearer " + localStorage.getItem("token")
        ),
      });

      return next.handle(cloneReq).pipe(
        tap(
          (succ) => {},
          (err) => {
            if (err.status == 401) {
              localStorage.removeItem("token");
              this.router.navigateByUrl("/login");
            }
            else if(err.status == 403)
            {
              this.router.navigateByUrl("/home");
            }
          }
        )
      );
    } else return next.handle(request.clone());
  }
}
