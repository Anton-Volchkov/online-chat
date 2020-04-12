import { Component, OnInit } from "@angular/core";
import { UserService } from "../shared/user.service";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  public formModel: FormGroup;
  constructor(public service: UserService, private router: Router,private fb: FormBuilder) {
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
        { validators: this.service.ComparePasswords }
      ),
    });
  }

  ngOnInit(): void {
    if(localStorage.getItem('token') != null)
    {
      this.router.navigateByUrl("/home")
    }
  }
  onSubmit() {
    this.service.Register(this.formModel).subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.formModel.reset();
          this.router.navigateByUrl("/login")
        } else {
          res.errors.forEach((element) => {
            switch (element.code) {
              case "DuplicateUserName":
               alert("Это имя уже занятно!");
                this.formModel.reset();
                break;
              default:

                break;
            }
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
