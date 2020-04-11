import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public formModel: FormGroup;
  private BaseURI : string = "https://localhost:44367"
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.formModel = this.fb.group({
      Login: ["", Validators.required],
      FirstName: ["", Validators.required],
      LastName: ["", Validators.required],
      Email: ["", Validators.email],
      Passwords: this.fb.group(
        {
          Password: ["", [Validators.required, Validators.minLength(6)]],
          ConfirmPassword: ["", [Validators.required]],
        },
        { validators: this.ComparePasswords }
      ),
    });
  }

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

  Register() {
    var body = {
      FirstName: this.formModel.value.FirstName,
      LastName: this.formModel.value.LastName,
      Login: this.formModel.value.Login,
      Email: this.formModel.value.Email,
      Password: this.formModel.value.Passwords.Password,
    };

   return this.http.post(this.BaseURI+"/User/Register",body);
  }
}
