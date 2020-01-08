import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { SelectionHandlerService } from '../../providers/selection-handler.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit {
  REGEX = new RegExp('^[a-zA-Z0-9__|-]*$');
  formControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.REGEX)
  ]);

  constructor(private selectionHandlerService: SelectionHandlerService) {
    this.formControl.valueChanges.subscribe((val) => {
      this.selectionHandlerService.setProjectNameError(this.isError(this.formControl.errors));
      this.selectionHandlerService.getProjectEvent().next(val);
    });
  }
  ngOnInit() {
    this.selectionHandlerService.setProjectNameError(true);
    this.selectionHandlerService.getProjectEvent().next('');

  }

  isError(errors) {
    return errors || this.formControl.pristine ? true : false;
  }

}
