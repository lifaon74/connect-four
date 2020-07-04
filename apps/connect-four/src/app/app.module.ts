import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ConnectFourComponent } from './components/connect-four/connect-four.component';
import { ConnectFourGameState } from './components/connect-four/+state/connect-four.state';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';
import { LocalizationModule } from '@app/ngx-localization';

const COMPONENTS = [
  ConnectFourComponent,
];

const STATES = [
  ConnectFourGameState
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
