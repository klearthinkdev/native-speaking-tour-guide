import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component/layout.component';
import { HomeComponent } from './pages/home.component/home.component';
import { LoginComponent } from './pages/login.component/login.component';
import { MeetingComponent } from './pages/meeting.component/meeting.component';
import { SignupComponent } from './pages/signup.component/signup.component';
import { StartAMeetingComponent } from './pages/start-a-meeting.component/start-a-meeting.component';
import { UserComponent } from './pages/user.component/user.component';

export const routes: Routes = [
  {
    path: 'welcome',
    component: LoginComponent,
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
        // TODO: canActivate 若尚未設定顯示暱稱 & 偏好語言，則導向個人頁面
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'meeting',
        component: MeetingComponent,
      },
      {
        path: 'start-a-meeting',
        component: StartAMeetingComponent,
        // TODO: canActivate
      },
    ],
  },
];
