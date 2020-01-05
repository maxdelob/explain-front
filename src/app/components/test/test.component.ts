import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  MatTreeNestedDataSource
} from '@angular/material/tree';
import {
  TreeControl,
  NestedTreeControl
} from '@angular/cdk/tree';
import {
  BehaviorSubject,
  Observable,
  of as observableOf
} from 'rxjs';
import {
  TerritoriesService
} from 'src/app/providers/territories.service';
import {
  subscribeOn
} from 'rxjs/operators';


export class TerritoireNode {
  id: string;
  idLevel0: string;
  idLevel1: string;
  idLevel2: string;
  idLevel3: string;
  name: string;
  level: number;
  children: TerritoireNode[];
}



@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  nestedTreeControl: NestedTreeControl < TerritoireNode > ;
  nestedDataSource: MatTreeNestedDataSource < TerritoireNode > ;
  datachange: BehaviorSubject < TerritoireNode[] > = new BehaviorSubject([]);
  listChildToLoad: TerritoireNode[] = [];
  hashDataLoaded = new Map();

  constructor(private territoriesService: TerritoriesService, private cdr: ChangeDetectorRef) {
    this.nestedTreeControl = new NestedTreeControl(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    this.datachange.subscribe(data => {
      this.nestedDataSource.data = data;
    });

    this.territoriesService.initTree().subscribe(data => {
      this.datachange.next(data);
    });
  }

  _getChildren = (node: TerritoireNode) => {
    return observableOf(node.children);
  }

  hasNestedChild = (_: number, nodeData: TerritoireNode) => {
    if (nodeData.children && nodeData.children.length > 0) {
      return true;
    } else {
      false;
    }
  }

  loadMoreChildren(node) {
    console.log(node);
    let regionChanged;
    this.territoriesService.getTree(node.id, node.level + 1).subscribe(res => {
      this.datachange.value.forEach(region => {
        const listDepartement = [];
        if (region.id === node["idLevelO"]) {
          console.log('join region');
          region.children.forEach(departement => {
            if (departement.id == node["idLevel1"]) {
              console.log('join dep');
              if (node.level == 1) {
                departement.children = res;
                listDepartement.push(departement);
              } else {
                const listEpci = [];
                if (departement.id == node["idLevel1"]) {
                  console.log('join dep');
                  departement.children.forEach(epci => {
                    if (epci.idLevel2 == node["idLevel2"]) {
                      console.log('join epci');
                      epci.children = res;
                      listEpci.push(epci);
                    } else {
                      listEpci.push(epci);
                    }
                  });
                  departement.children = listEpci;
                  listDepartement.push(departement);
                }
              }
            } else {
              listDepartement.push(departement);
            }
          });
          region.children = listDepartement;
          regionChanged = region;
        }
      });

      // parse the data correctly
      const parsedData = []
      this.datachange.value.forEach(region => {
        if (region.id == node["idLevelO"]) {
          parsedData.push(regionChanged)
        } else {
          parsedData.push(region);
        }
      });
      this.datachange.next([]);
      this.datachange.next(parsedData);

      // console.log(parsedData)
    });
  }
}
