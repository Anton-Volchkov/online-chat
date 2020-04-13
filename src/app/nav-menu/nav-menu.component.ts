import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../shared/user.service";
import { UserProfile } from "../Models/UserProfile";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.scss"],
})
export class NavMenuComponent implements OnInit {
  public currentUser: UserProfile = new UserProfile();

  constructor(private service: UserService, private router: Router) {
    if (localStorage.getItem("token") == null) {
      this.router.navigateByUrl("/login");
    }
  }

  ngOnInit(): void {
    var payload = JSON.parse(
      window.atob(localStorage.getItem("token").split(".")[1])
    );
    this.currentUser.roles = this.service.getUserRoles();
   
    this.service.GetUserInfo(payload.UserID).subscribe((response) => {
      this.currentUser.firstName = response.firstName;
      this.currentUser.lastName = response.lastName;
      this.currentUser.login = response.login;
      this.currentUser.email = response.email;
      this.currentUser.dateRegister = response.dateRegister;
      this.currentUser.fullName = `${response.firstName} ${response.lastName}`;
    });
  }
  CheckAccess(nameRole: string): boolean {
    return this.service.roleMatch([nameRole]);
  }
  LogOut() {
    localStorage.removeItem("token");
    this.router.navigateByUrl("");
  }
}
