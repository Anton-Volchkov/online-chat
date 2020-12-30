import { Injectable, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserProfile } from "../Models/UserProfile";
import { ChatUser } from "../Models/ChatUser";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject("SERVER_URL") private serverUrl: string
  ) {}

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
    var values = formModel.value;
    var imgPath: string =
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png";

    if (!values.ImagePath) {
      values.ImagePath = imgPath;
    } else {
      values.ImagePath.trim() == ''
        ? imgPath
        : values.ImagePath;
    }
   
    var body = {
      FirstName: values.FirstName,
      LastName: values.LastName,
      Login: values.Login,
      Email: values.Email,
      ImagePath: values.ImagePath,
      Password: values.Passwords.Password,
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

  GetChatUserInfo(userID: string) {
    return this.http.get<ChatUser>(
      this.serverUrl + "/User/GetChatUserInfo/" + userID
    );
  }

  GetAllUsersInfo() {
    return this.http.get<ChatUser[]>(this.serverUrl + "/User/GetAllUsersInfo");
  }

  GetUserID(): string {
    var payload = this.getPayload();

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

    var payload = this.getPayload();
    var userRoles = payload.role as Array<string>;

    if (typeof userRoles == "string") {
      userRoles = new Array<string>(userRoles);
    }

    return userRoles;
  }

  getPayload()
  {
    try{
      var payload = JSON.parse(
        window.atob(localStorage.getItem("token").split(".")[1])
      );
      return payload;
    }
    catch(error)
    {
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    }
  }

}
