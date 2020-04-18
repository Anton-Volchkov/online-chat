import { Component, OnInit } from "@angular/core";
import { NgForm, FormBuilder } from "@angular/forms";
import { UserService } from "../shared/user.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(
    private service: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("token") != null) {
      this.router.navigateByUrl("/home");
    }
  }

  CheckOnWhiteSpace(event: any) {
    if (event.key == " ") return false;
  }

  onSubmit(form: NgForm) {
    this.service.Login(form.value).subscribe(
      (res: any) => {
        localStorage.setItem("token", res.token);
        this.router.navigateByUrl("/home");
      },
      (err) => {
        if (err.status == 400) {
          this.toastr.error("Неверное имя пользователя или пароль!","Ошибка");
          form.reset();
        }
      }
    );
  }
}
