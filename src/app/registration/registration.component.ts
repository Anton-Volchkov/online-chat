import { Component, OnInit } from "@angular/core";
import { UserService } from "../shared/user.service";


@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  constructor(public service: UserService) {}

  ngOnInit(): void {}
  onSubmit() {
    this.service.Register().subscribe(
      (res: any) => {
        if (res.succeded) {
          this.service.formModel.reset();
        } else {
          res.errors.forEach((element) => {
            switch (element.code) {
              case "DuplicateUserName":
               alert("Это имя уже занятно!");
                this.service.formModel.reset();
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
