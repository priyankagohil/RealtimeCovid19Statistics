import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CountriesComponent } from './components/countries/countries.component';
import { AboutmeComponent } from './components/aboutme/aboutme.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path:'countries', component: CountriesComponent},
  {path:'aboutme', component: AboutmeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
