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
  SelectionModel
} from '@angular/cdk/collections';


export class TerritoireNode {
  id: string;
  idLevel0: string;
  idLevel1: string;
  idLevel2: string;
  idLevel3: string;
  name: string;
  level: number;
  children: TerritoireNode[];
  isToggled: boolean;
  isExpended: boolean;
}

@Component({
  selector: 'app-tree-view',
  templateUrl: 'tree-view.component.html',
  styleUrls: ['tree-view.component.scss']
})
export class TreeViewComponent {
  DEBUG = false;

  nestedTreeControl: NestedTreeControl < TerritoireNode > ; // tree view control type
  nestedDataSource: MatTreeNestedDataSource < TerritoireNode > ; // tree view Datasource type


  datachange: BehaviorSubject < TerritoireNode[] > = new BehaviorSubject([]); // control the tree view
  selectionchange: BehaviorSubject < TerritoireNode[] > = new BehaviorSubject([]); // control the checkboxes
  checklistSelection = new SelectionModel < TerritoireNode > (true /* multiple */ ); // control the checkboxes
  selectionData: TerritoireNode[] = [];


  constructor(private territoriesService: TerritoriesService, private cdr: ChangeDetectorRef) {
    this.nestedTreeControl = new NestedTreeControl(this._getChildren); // control the tree view
    this.nestedDataSource = new MatTreeNestedDataSource(); // control the tree view

    this.datachange.subscribe(data => {
      this.nestedDataSource.data = data;
    });

    this.territoriesService.initTree().subscribe(data => {
      this.datachange.next(data);
      this.nestedTreeControl.expand(this.datachange.value[0]);
    });

    this.selectionchange.subscribe(data => {
      data.forEach(elm => {
        // console.log(elm.isToggled)
        if (elm.isToggled) {
          this.selectionData.push(elm);
        } else {
          // console.log('remove ', elm.name);
          this.selectionData.splice(this.selectionData.indexOf(elm), 1);
        }
      });
      console.log(this.selectionData)
    });

  }

  // Function needed by Angular for NestedTreeControl to work
  _getChildren = (node: TerritoireNode) => {
    return observableOf(node.children);
  }

  // Function needed by Angular to detected whenever there is a tree to expand
  hasNestedChild = (_: number, nodeData: TerritoireNode) => {
    if (nodeData.children && nodeData.children.length > 0) {
      return true;
    } else {
      false;
    }
  }

  // Function launch when EPCI or Commune are selected to get the slice of data needed
  loadMoreChildren(node) {
    if (!node.isExpended) {
      // console.log(this.datachange.value)
      this.territoriesService.getTree(node.id, parseInt(node.level) + 1).subscribe(res => {
        const data = this.addChildrenToParent(node, res);
        this.datachange.next([]); // force to recreate (material bug)
        this.datachange.next(data);
        // this.initCheckboxes();
      });
      node.isExpended = !node.isExpended;
    } else {
      // console.log(this.datachange.value)
      //this.initCheckboxes()
      // console.log('lol')
    }
  }

  // Function which add a node to the tree
  addChildrenToParent(node, children): TerritoireNode[] {
    let regionChanged;
    this.datachange.value.forEach(pays => {
      pays.children.forEach(region => {
        const listDepartement = [];
        if (region.id === node["idLevel0"]) {
          if (this.DEBUG) {
            console.log('join region ', region.id);
          }
          region.children.forEach(departement => {
            if (departement.id == node['idLevel1']) {
              if (this.DEBUG) {
                console.log('join dep ', departement.id);
              }
              if (node.level == 1) {
                departement.children = children;
                listDepartement.push(departement);
              } else {
                const listEpci = [];
                if (departement.id == node['idLevel1']) {
                  if (this.DEBUG) {
                    console.log('join dep  ', departement.id);
                  }
                  departement.children.forEach(epci => {
                    if (epci.id == children[0].idLevel2) {
                      if (this.DEBUG) {
                        console.log('join epci  ', epci.id);
                      }
                      epci.children = children;
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
    })

    // parse the data correctly
    const parsedData = []
    this.datachange.value.forEach(region => {
      if (region.id == node["idLevel0"]) {
        parsedData.push(regionChanged)
      } else {
        parsedData.push(region);
      }
    });

    return parsedData;

  }

  // Function that sets the correct value of the checkboxes (toggle or not)
  initCheckboxes() {
    this.checkBoxes(this.datachange.value);
    this.datachange.value.forEach((pays) => {
      pays.children.forEach((region) => {
        if (region.children.length > 0) {
          this.checkBoxes(region.children);
          region.children.forEach(dep => {
            if (dep.children) {
              if (dep.children.length > 0) {
                this.checkBoxes(dep.children);
                dep.children.forEach(epci => {
                  this.checkBoxes(epci.children);
                });
              }
            }
          });
        }
      });
    });
  }

  // Function that toggle all checkbox of a node
  checkBoxes(list: TerritoireNode[]) {
    list.forEach((elm) => {
      elm.isToggled ? this.checklistSelection.select(elm) : this.checklistSelection.deselect(elm);
    });
  }

  // Launch when clicked on a checkbox
  todoItemSelectionToggle(node: TerritoireNode): void {
    const closedDescendants = this.nestedTreeControl.getDescendants(node).filter(elm => elm.level === node.level + 1);
    if (closedDescendants.length === 0 && node.level !== 3) { // when we did not load data and we select it
      this.territoriesService.getTree(node.id, node.level + 1).subscribe(res => {
        const data = this.addChildrenToParent(node, res);
        this.datachange.next([]); // force to recreate (material bug)
        this.datachange.next(data);
        this.checklistSelection.select(node);
        res.forEach(elm => {
          this.checklistSelection.select(elm);
          elm.isToggled = true;
        });
        node.isToggled = !node.isToggled;
        this.selectionchange.next([node]);
        this.selectionchange.next(res);
        node.isExpended = !node.isExpended;
      });
    } else {
      !node.isToggled ? this.checklistSelection.select(...closedDescendants) : this.checklistSelection.deselect(...closedDescendants);
      node.isToggled = !node.isToggled;
      closedDescendants.forEach(element => {
        element.isToggled = !element.isToggled;
      });
      this.selectionchange.next([node]);
      this.selectionchange.next(closedDescendants);
    }

  }


  unSelectAllBoxes() {

    this.datachange.value.forEach((pays) => {
      pays.children.forEach((region) => {
        region.isToggled = false;
        region.children.forEach(dep => {
          dep.isToggled = false;
          if (dep.children) {
            dep.children.forEach(epci => {
              epci.isToggled = false;
              if (epci.children) {
                epci.children.forEach(commune => {
                  commune.isToggled = false;
                });
              }
            });
          }
        });
      })
    });
    this.initCheckboxes();
    const init = this.datachange.value;
    this.datachange.next([]);
    this.datachange.next(init);
    this.selectionchange.next([]);
  }


  // getParentNode(node: TerritoireNode): TerritoireNode | null {
  //   let region, dep;
  //   let nodeFind = null;
  //   switch (node.level) {
  //     case 0:
  //       return null // region
  //     case 1: // dep
  //       nodeFind = this.datachange.value.filter((elm) => {
  //         return elm.id === node["idLevel0"]
  //       })[0];
  //       break;
  //     case 2: // epci
  //       console.log('here');
  //       region = this.datachange.value.filter((elm) => {
  //         return elm.id === node["idLevel0"]
  //       })[0];
  //       nodeFind = region.children.filter(elm => {
  //         return elm.id === node["idLevel1"]
  //       })[0];
  //       break;
  //     case 3: // commune

  //       region = this.datachange.value.filter((elm) => {
  //         return elm.id === node["idLevel0"]
  //       })[0];
  //       dep = region.children.filter(elm => {
  //         return elm.id === node["idLevel1"]
  //       })[0];
  //       console.log(dep);
  //       nodeFind = dep.children.filter(elm => {
  //         return elm.id === node["idLevel2"]
  //       })[0];
  //   }
  //   return nodeFind;
  // }


  test() {
    console.log()
  }
}
