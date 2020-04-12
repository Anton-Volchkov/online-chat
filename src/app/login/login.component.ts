import { Component, OnInit } from '@angular/core';
import {NgForm, FormBuilder} from '@angular/forms';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private service: UserService, private router:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('token') != null)
    {
      this.router.navigateByUrl("/home")
    }
  }

  onSubmit(form:NgForm)
  {
    this.service.Login(form.value).subscribe((res:any)=>{
      localStorage.setItem('token',res.token);
      this.router.navigateByUrl("/home")
    },
    err=>
    {
      if(err.status == 400)
      {
        alert("Неверное имя пользователя или пароль!");
        form.reset();
      }
    });
  }

}
