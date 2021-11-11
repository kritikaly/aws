import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeFeedComponent } from './components/home-feed/home-feed.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { ExploreComponent } from './components/explore/explore.component';
import { InterceptorInterceptor } from './auth/interceptor.interceptor';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { DropzoneDirective } from './directives/dropzone.directive';
import { DropzoneComponent } from './components/dropzone/dropzone.component';
import { StringFormatPipe } from './pipes/string-format.pipe';
import { ImageDetailsComponent } from './components/image-details/image-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeFeedComponent,
    UserDetailsComponent,
    ExploreComponent,
    DropzoneDirective,
    DropzoneComponent,
    StringFormatPipe,
    ImageDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
