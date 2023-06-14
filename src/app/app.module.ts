import { APP_BASE_HREF } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";
// import { HashLocationStrategy, LocationStrategy  } from '@angular/common';

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ThemeModule } from "./@theme/theme.module";
import { NgModule } from "@angular/core";
import { AuthInterceptor } from "./@core/auth/mock/auth.interceptor";
// import { NbToastrModule } from "@nebular/theme";
// import { TypeaheadModule } from "ngx-bootstrap/typeahead";
// import { LowerCaseUrlSerializerService } from './@core/utils/lowerCaseUrlSerialiazer.service';
// import { UrlSerializer } from "@angular/router";
import { AddCsrfHeaderInterceptor } from './@core/auth/mock/addCsrfHeader.interceptor';

// import fa  from '@angular/common/locales/fa';
// registerLocaleData(fa,'fa');

import { JwtModule } from "@auth0/angular-jwt";
export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    // Adding Core Modules
    // NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    // TypeaheadModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // allowedDomains: ["example.com"],
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    //for no need web.config in publish,pelease test it.
    // {provide : LocationStrategy , useClass: HashLocationStrategy},
    { provide: APP_BASE_HREF, useValue: "/" },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS,
      useClass: AddCsrfHeaderInterceptor,
      multi: true }
    // {
    //   provide: UrlSerializer,
    //   useClass: LowerCaseUrlSerializerService
    // }
  ]

})
export class AppModule {}
