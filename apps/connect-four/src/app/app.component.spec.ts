import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';
import { LocalizationModule } from '@app/ngx-localization';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WinPopupComponent } from './components/popups/win-popup/win-popup.component';
import { ConnectFourComponent } from './components/connect-four/connect-four.component';
import { ConnectFourGameState } from './components/connect-four/+state/connect-four.state';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';

const POPUPS = [
  WinPopupComponent
];

const COMPONENTS = [
  ConnectFourComponent,
  ...POPUPS
];

const STATES = [
  ConnectFourGameState
];


const MATERIAL_MODULES = [
  MatButtonModule,
  MatToolbarModule,
  MatDialogModule
];


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        NgxsModule.forRoot(STATES, {
          developmentMode: !environment.production
        }),
        LocalizationModule.forRoot(),
        BrowserAnimationsModule,
        ...MATERIAL_MODULES
      ],
      declarations: [
        AppComponent,
        ...COMPONENTS,
      ],
      providers: [],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
