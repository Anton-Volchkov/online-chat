import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private BaseURI: string = "https://localhost:44367";
  constructor(
    private http: HttpClient,
    private router: Router
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
    var body = {
      FirstName: formModel.value.FirstName,
      LastName: formModel.value.LastName,
      Login: formModel.value.Login,
      Email: formModel.value.Email,
      Password: formModel.value.Passwords.Password,
    };

    return this.http.post(this.BaseURI + "/User/Register", body);
  }

  Login(data) {
    return this.http.post(this.BaseURI + "/User/Login", data);
  }

  roleMatch(allowedRoles: Array<string>) {
    if (localStorage.getItem("token") == null) {
      this.router.navigateByUrl("/login");
    }

    var payload = JSON.parse(
      window.atob(localStorage.getItem("token").split(".")[1])
    );
    var userRole = payload.role;

    var isMatch: boolean = false;

    userRole.forEach((element) => {
      var res = allowedRoles.find((x) => x == element);

      if (res) {
        isMatch = true;
      }
    });

    return isMatch;
  }
}
