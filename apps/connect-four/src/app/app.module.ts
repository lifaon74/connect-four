import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ConnectFourComponent } from './components/connect-four/connect-four.component';
import { ConnectFourGameState } from './components/connect-four/+state/connect-four.state';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';
import { LocalizationModule } from '@app/ngx-localization';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';


const COMPONENTS = [
  ConnectFourComponent
];

const STATES = [
  ConnectFourGameState
];


const MATERIAL_MODULES = [
  MatButtonModule,
  MatToolbarModule
];


@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS
  ],
  imports: [
    BrowserModule,
    NgxsModule.forRoot(STATES, {
      developmentMode: !environment.production
    }),
    LocalizationModule.forRoot(),
    BrowserAnimationsModule,
    ...MATERIAL_MODULES
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
