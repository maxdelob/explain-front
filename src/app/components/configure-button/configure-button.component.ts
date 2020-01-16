import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input
} from '@angular/core';
import {
  SelectionHandlerService
} from '../../providers/selection-handler.service';
import {
  ListElement
} from 'src/app/interfaces/list-element';
import {
  FormControl,
  Validators
} from '@angular/forms';
import {
  Territoire
} from 'src/app/interfaces/territoire';
import {
  stringify
} from 'querystring';

@Component({
  selector: 'app-configure-button',
  templateUrl: './configure-button.component.html',
  styleUrls: ['./configure-button.component.scss']
})
export class ConfigureButtonComponent {
  TYPE_THEME = 'Themes';
  TYPE_SOURCE = 'Sources';
  listThemeSelected: ListElement[] = [];
  listSourceSelected: ListElement[] = [];
  listTerritories: Territoire[] = [];
  projectName: string;
  disableButton = true;
  isProjectNameError = true;
  isThemeError = true;
  isSourceError = true;
  isTreeError = true;
  constructor(private selectionHandlerService: SelectionHandlerService, private cd: ChangeDetectorRef) {

    this.selectionHandlerService.getListEvent().subscribe((val) => {
      switch (val[1]) {
        case this.TYPE_THEME:
          this.listThemeSelected = val[0];
          this.isThemeError = this.selectionHandlerService.getThemeError();
          this.isButtonDisabled();
          break;
        case this.TYPE_SOURCE:
          this.listSourceSelected = val[0];
          this.isSourceError = this.selectionHandlerService.getSourceError();
          this.isButtonDisabled();
          break;
      }
    });

    this.selectionHandlerService.getProjectEvent().subscribe((val) => {
      this.projectName = val;
      this.isProjectNameError = this.selectionHandlerService.getProjectNameError();
      this.isButtonDisabled();
    });

    this.selectionHandlerService.getTreeEvent().subscribe((val) => {
      this.listTerritories = val;
      this.isTreeError = this.selectionHandlerService.getTreeError();
      this.isButtonDisabled();
    });
  }


  isButtonDisabled() {
    if (this.isSourceError || this.isThemeError || this.isProjectNameError || this.isTreeError) {
      this.disableButton = true;
    } else {
      this.disableButton = false;
    }
  }

  export () {
    const obj = {
      project_code: this.projectName,
      territories: this.listTerritories.map(elm => elm.pcode),
      themes: this.listThemeSelected.map(elm => elm.name),
      sources: this.listSourceSelected.map(elm => elm.name)
    };
    this.exportDocument(JSON.stringify(obj));
  }

  exportDocument(jsonToSave) {
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(jsonToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'config_' + this.projectName + '.json';
    hiddenElement.click();
  }

}
