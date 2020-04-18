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
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { UserService } from './shared/user.service';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './Auth/auth.guard';
import { AuthInterceptor } from './Auth/auth.interceptor';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AppComponent, NavMenuComponent, LoginComponent, RegistrationComponent, HomeComponent, AdminPanelComponent],
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
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
      {path:'login',component: LoginComponent},
      { path: 'registration', component: RegistrationComponent},
      {path:'home',component: HomeComponent, canActivate:[AuthGuard]},
      {path:'admin-panel', component:AdminPanelComponent,canActivate:[AuthGuard],data:{permittedRoles:['Admin']}},
      { path: '**', component: LoginComponent }
     ]),

  ],
  providers: [UserService,{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
