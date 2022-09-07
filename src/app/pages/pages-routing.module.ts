import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { ForbiddenComponent } from './miscellaneous/forbidden/forbidden.component';
import { AuthGuard } from '../@core/auth/mock/authguard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  canActivate:[AuthGuard],
  runGuardsAndResolvers: 'always',
  children: [  {
    path: 'forms',
    loadChildren: './forms/forms.module#FormsModule',
  }, {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
  }, {
    path: 'miscellaneous',
    loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
  }, 
  {
    path: '',
    redirectTo: 'forms',
    pathMatch: 'full',
  },
    {
    path: '403',
    component: ForbiddenComponent,
  },
   {
    path: '404',
    component: NotFoundComponent
  },
  // {
  //   path: '',
  //   redirectTo: 'forms',
  //   pathMatch: 'full',
  // },
  {
    path:'**',
    component: NotFoundComponent
  }
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

