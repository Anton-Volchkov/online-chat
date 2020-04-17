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
  private baseToken: string;
  constructor(private service: UserService, private router: Router) {
    this.baseToken = localStorage.getItem("token");
  }

  ngOnInit(): void {
    var payload = JSON.parse(
      window.atob(localStorage.getItem("token").split(".")[1])
    );

    setInterval(() => {
      if (!localStorage.getItem("token")) {
        document.location.href = "/login";
      } else if (localStorage.getItem("token") != this.baseToken) {
        localStorage.removeItem("token");
        document.location.href = "/login";
      }
    }, 1000);

    this.service.GetUserInfo(payload.UserID).subscribe((response) => {
      this.currentUser = response;
    });
  }
  CheckAccess(nameRole: string): boolean {
    return this.service.roleMatch([nameRole]);
  }
  LogOut() {
    localStorage.removeItem("token");
    document.location.href = "/login";
  }
}
