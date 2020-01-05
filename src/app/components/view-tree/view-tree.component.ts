import {
  Component,
  OnInit
} from '@angular/core';
import {
  TerritoriesService
} from '../../providers/territories.service';
import { Administrative } from 'src/app/interfaces/administrative';

@Component({
  selector: 'view-tree',
  templateUrl: './view-tree.component.html',
  styleUrls: ['./view-tree.component.scss']
})
export class ViewTreeComponent implements OnInit {
  regions: Administrative[];
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  constructor(private territoriesService: TerritoriesService) {}

  ngOnInit() {
    this.territoriesService.getRegion().subscribe((res) => { this.regions = res; });
  }

}
