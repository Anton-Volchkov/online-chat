import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
currentUser={
  UserId:0,
  Role:""  
}
  constructor(private service: UserService, private router:Router) {
    if(localStorage.getItem('token') == null)
    {
      this.router.navigateByUrl("/login")
    }

   }

  ngOnInit(): void {
    var payload = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    this.currentUser.Role = payload.role;
    this.currentUser.UserId = payload.UserID;
  }

  LogOut()
  {
    localStorage.removeItem('token');
    this.router.navigateByUrl("");
  }
}
