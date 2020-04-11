import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import {
  CheckboxModule,
  WavesModule,
  ButtonsModule,
  InputsModule,
  IconsModule,
  CardsModule,
  NavbarModule,
} from "angular-bootstrap-md";
import {ReactiveFormsModule,FormsModule, Validators} from "@angular/forms";
import { RouterModule } from '@angular/router';

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import {HttpClientModule} from '@angular/common/http'
import { UserService } from './shared/user.service';


@NgModule({
  declarations: [AppComponent, NavMenuComponent, LoginComponent, RegistrationComponent],
  imports: [
    BrowserModule,
    CheckboxModule,
    WavesModule,
    ButtonsModule,
    InputsModule,
    IconsModule,
    CardsModule,
    NavbarModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'registration', component: RegistrationComponent},
    ]),

  ],
  providers: [UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
