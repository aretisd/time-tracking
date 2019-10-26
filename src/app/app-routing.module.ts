import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ResultComponent } from './result/result.component';
import { StartComponent } from './start/start.component';
import { PrintComponent } from './print/print.component';


const routes: Routes = [
  { path: 'start', component: StartComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'result', component: ResultComponent },
  { path: 'print', component: PrintComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
