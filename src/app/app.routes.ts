import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component/layout.component';
import { HomeComponent } from './pages/home.component/home.component';
import { LoginComponent } from './pages/login.component/login.component';
import { MeetingComponent } from './pages/meeting.component/meeting.component';
import { SignupComponent } from './pages/signup.component/signup.component';
import { UserComponent } from './pages/user.component/user';
import { WelcomeComponent } from './pages/welcome.component/welcome.component';

export const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'meeting',
        component: MeetingComponent,
      },
    ],
  },
];
