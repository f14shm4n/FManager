import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarButtonComponent } from './toolbar-button/toolbar-button.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ToolbarButtonComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
