import { Component } from '@angular/core';
import { ThemesService } from '../../providers/themes.service';
import { ListElement } from 'src/app/interfaces/list-element';


@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent {
  public TYPE = 'Themes';
  public themes: ListElement[] = [];
  constructor(private themesService: ThemesService) { 
    this.themesService.get().subscribe((res) => {this.themes = res;});
  }
}
