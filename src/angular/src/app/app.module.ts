import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FeToolbarComponent } from './fe-toolbar/fe-toolbar.component';
import { FeFolderContentComponent } from './fe-folder-content/fe-folder-content.component';

@NgModule({
  declarations: [
    AppComponent,    
    FeToolbarComponent,    
    FeFolderContentComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
