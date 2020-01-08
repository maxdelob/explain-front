import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../assets/angular-material.module';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutComponent } from './pages/layout/layout.component';
import { ThemesComponent } from './pages/themes/themes.component';
import { InputComponent } from './pages/input/input.component'
import { SourcesComponent } from './pages/sources/sources.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { ConfigureButtonComponent } from './components/configure-button/configure-button.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    TreeViewComponent,
    ThemesComponent,
    ListViewComponent,
    SourcesComponent,
    InputComponent,
    ConfigureButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
