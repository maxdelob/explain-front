import { Component, OnInit } from '@angular/core';
import { ListElement } from '../../interfaces/list-element';
import { SourcesService } from 'src/app/providers/sources.service';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent {
  public TYPE = 'Sources';
  public sources: ListElement[] = [];
  constructor( private sourceService: SourcesService) {
    this.sourceService.get().subscribe((res) => {
      this.sources = res; });
  }
}
