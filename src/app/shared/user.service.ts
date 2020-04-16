import { Injectable,Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserProfile } from "../Models/UserProfile";
import { ChatUser } from '../Models/ChatUser';

@Injectable({
  providedIn: "root",
})
export class UserService {
 
  constructor(private http: HttpClient, private router: Router, @Inject("SERVER_URL") private serverUrl: string) {}

  ComparePasswords(fb: FormGroup) {
    let confirmPass = fb.get("ConfirmPassword");

    if (
      confirmPass.errors == null ||
      "passwordMismatch" in confirmPass.errors
    ) {
      if (fb.get("Password").value != confirmPass.value)
        confirmPass.setErrors({ passwordMismatch: true });
      else confirmPass.setErrors(null);
    }
  }

  Register(formModel: FormGroup) {
    var imgPath =
      formModel.value.ImagePath.trim() == ''
        ? "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"
        : formModel.value.ImagePath;
  
    var body = {
      FirstName: formModel.value.FirstName,
      LastName: formModel.value.LastName,
      Login: formModel.value.Login,
      Email: formModel.value.Email,
      ImagePath: imgPath,
      Password: formModel.value.Passwords.Password,
    };
 
    return this.http.post(this.serverUrl + "/User/Register", body);
  }

  Login(data) {
    return this.http.post(this.serverUrl + "/User/Login", data);
  }

  GetUserInfo(userID: string) {
    return this.http.get<UserProfile>(
      this.serverUrl + "/User/GetUserInfo/" + userID
    );
  }

  GetAllUsersInfo() {
    return this.http.get<ChatUser[]>(
      this.serverUrl + "/User/GetAllUsersInfo"
    );
  }



  GetUserID(): string {
    var payload = JSON.parse(
      window.atob(localStorage.getItem("token").split(".")[1])
    );

    return payload.UserID;
  }

  roleMatch(allowedRoles: Array<string>) {
    if (localStorage.getItem("token") == null) {
      this.router.navigateByUrl("/login");
    }

    var userRole = this.getUserRoles();

    var isMatch: boolean = false;

    userRole.forEach((element) => {
      var res = allowedRoles.find((x) => x == element);

      if (res) {
        isMatch = true;
      }
    });

    return isMatch;
  }

  getUserRoles(): Array<string> {
    if (localStorage.getItem("token") == null) {
      this.router.navigateByUrl("/login");
    }

    var payload = JSON.parse(
      window.atob(localStorage.getItem("token").split(".")[1])
    );
    var userRoles = payload.role as Array<string>;

    if (typeof userRoles == "string") {
      userRoles = new Array<string>(userRoles);
    }

    return userRoles;
  }
}
