import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../assets/angular-material.module';
import { HttpClientModule } from '@angular/common/http';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { TreeLoadmoreExample } from './tree-loadmore-example/tree-loadmore-example.component';
import { ViewTreeComponent } from './components/view-tree/view-tree.component';
import { TreeDynamicExampleComponent } from './tree-dynamic-example/tree-dynamic-example.component';
import { TestComponent } from './components/test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    TreeViewComponent,
    TreeLoadmoreExample,
    ViewTreeComponent,
    TreeDynamicExampleComponent,
    TestComponent
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
