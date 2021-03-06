import { Component, OnInit } from "@angular/core";
import { UserService } from "../shared/user.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  public formModel: FormGroup;
  constructor(
    public service: UserService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.formModel = this.fb.group({
      Login: ["", Validators.required],
      FirstName: ["", Validators.required],
      LastName: ["", Validators.required],
      Email: ["", Validators.email],
      ImagePath: [""],
      Passwords: this.fb.group(
        {
          Password: ["", [Validators.required, Validators.minLength(6)]],
          ConfirmPassword: ["", [Validators.required]],
        },
        { validators: this.service.ComparePasswords }
      ),
    });
  }

  CheckOnWhiteSpace(event: any) {
    if (event.key == " ") return false;
  }

  ngOnInit(): void {
    if (localStorage.getItem("token") != null) {
      this.router.navigateByUrl("/home");
    }
  }
  onSubmit() {
    this.formModel.disable();
    this.service.Register(this.formModel)?.subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.formModel.reset();
          this.toastr.success("Вы успешно зарегистрировались! Пожалуйста, авторизуйтесь.","Успех");
          this.router.navigateByUrl("/login");
        } else {
          this.formModel.enable();
          res.errors.forEach((element) => {
            switch (element.code) {
              case "DuplicateUserName":
                this.toastr.error("Это имя уже занятно!","Ошибка");
                this.formModel.reset();
                break;

              case "DuplicateEmail":
                this.toastr.error("Эта почта занята!","Ошибка");
                break;

              default:
                this.toastr.error(
                  "При регистрации что-то пошло не так! Возможно вы ввели некорректные данные."
                ,"Ошибка");
                this.formModel.reset();
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
