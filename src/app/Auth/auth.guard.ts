import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../shared/user.service";
import { element } from "protractor";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private service: UserService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (localStorage.getItem("token") != null) {
      var roles = next.data["permittedRoles"] as Array<string>;
      if (roles) {
        if (this.service.roleMatch(roles)) return true;
        else
        {
          this.router.navigateByUrl('/login');
          return false;
        } 
      }
      return true;
    } else this.router.navigateByUrl("");
  }
}
