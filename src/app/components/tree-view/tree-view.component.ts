import {
  Component
} from '@angular/core';
import {
  MatTreeNestedDataSource
} from '@angular/material/tree';
import {
  NestedTreeControl
} from '@angular/cdk/tree';
import {
  BehaviorSubject,
  of as observableOf
} from 'rxjs';
import {
  TerritoriesService
} from 'src/app/providers/territories.service';
import {
  SelectionModel
} from '@angular/cdk/collections';
import {
  Territoire
} from '../../interfaces/territoire';
import { SelectionHandlerService } from '../../providers/selection-handler.service';

@Component({
  selector: 'app-tree-view',
  templateUrl: 'tree-view.component.html',
  styleUrls: ['tree-view.component.scss']
})
export class TreeViewComponent {
  DEBUG = false;

  nestedTreeControl: NestedTreeControl < Territoire > ; // tree view control type
  nestedDataSource: MatTreeNestedDataSource < Territoire > ; // tree view Datasource type
  datachange: BehaviorSubject < Territoire[] > = new BehaviorSubject([]); // control the tree view
  selectionchange: BehaviorSubject < Territoire[] > = new BehaviorSubject([]); // control the checkboxes
  checklistSelection = new SelectionModel < Territoire > (true /* multiple */ ); // control the checkboxes
  selectionData: Territoire[] = [];
  isEmpty = false; // check whenever the selectionData is empty (error message + disabled the configure button)
  pritine = true;
  lastNode;

  constructor(private territoriesService: TerritoriesService, private selectionHandlerService: SelectionHandlerService) {
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
      this.handleSelection(data);
      if(this.pritine) { this.isEmpty = false; } // handle the Observable init
      this.pritine = false;
    });

  }

  // Function needed by Angular Material for NestedTreeControl to work
  _getChildren = (node: Territoire) => {
    return observableOf(node.children);
  }

  // Function needed by Angular to detected whenever there is a tree to expand
  hasNestedChild = (_: number, nodeData: Territoire) => {
    if (nodeData.children && nodeData.children.length > 0) {
      return true;
    } else {
      false;
    }
  }

  // Function launch when EPCI or Commune are selected to get the slice of data needed
  loadMoreChildren(node) {
    if (!node.isExpended) { // avoid bug when reopening parent
      this.territoriesService.getTree(node.id, parseInt(node.level) + 1).subscribe(res => {
        const data = this.addChildrenToParent(node, res);
        node.isExpended = !node.isExpended;
        this.datachange.next([]); // force to recreate (material bug)
        this.datachange.next(data);
        this.initCheckboxes();
      });
    }
  }

  // Function which add a node to the tree
  addChildrenToParent(node, children): Territoire[] {
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
      this.checkBoxes(pays.children);
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
  checkBoxes(list: Territoire[]) {
    list.forEach((elm) => {
      elm.isToggled ? this.checklistSelection.select(elm) : this.checklistSelection.deselect(elm);
    });
  }

  // Launch when clicked on a checkbox
  todoItemSelectionToggle(node: Territoire): void {
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
      if(node.level !== 3) {this.selectionchange.next(closedDescendants)};
      node.isExpended = !node.isExpended;
    }

    this.lastNode = node;
  }


  unSelectAllBoxes() {
    this.datachange.value.forEach((pays) => {
      pays.isToggled = false;
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
      });
    });

    const data = this.datachange.value;
    this.datachange.next([]); //force recreate
    this.datachange.next(data); 
    this.initCheckboxes(); // uncheck boxes
    this.checklistSelection.deselect(...this.datachange.value); // bug with region selected (force uncheck)
    this.selectionchange.next([]); // embpty selection
    this.isEmpty = true; // handle error message
    this.selectionHandlerService.setTreeError(this.isEmpty);
    this.selectionHandlerService.getTreeEvent().next(this.selectionData);
   
  }

  handleSelection(data) {
    data.forEach(elm => {
      elm.isToggled ? this.selectionData.push(elm) : this.selectionData.splice(this.selectionData.indexOf(elm), 1);
    });
    // this.removeParent(data);
    this.selectionData.length > 0 ? this.isEmpty = false : this.isEmpty = true;

    this.selectionHandlerService.setTreeError(this.isEmpty);
    this.selectionHandlerService.getTreeEvent().next(this.selectionData);

  }


  // remove parent node for list selection if present
  removeParent(data) {
    const parents = [];
    data.forEach(elm => {
      if (this.getParentNode(elm)) {
        parents.push(this.getParentNode(elm));
      }
    });
    const parentsUnique = new Set(parents); // avoid duplicates
    parentsUnique.forEach(elm => {
      this.selectionData.splice(this.selectionData.indexOf(elm), 1);
    });

  }


  // find parent node
  getParentNode(node: Territoire): Territoire | null {
    let region, dep;
    let nodeFind = null;
    let pays = this.datachange.value[0];
    if (pays) {
      const data = pays.children;
      switch (node.level) {
        case 0:
          return null // region
        case 1: // dep
          nodeFind = data.filter((elm) => {
            return elm.id === node["idLevel0"]
          })[0];
          break;
        case 2: // epci
          region = data.filter((elm) => {
            return elm.id === node["idLevel0"]
          })[0];
          nodeFind = region.children.filter(elm => {
            return elm.id === node["idLevel1"]
          })[0];
          break;
        case 3: // commune
          region = data.filter((elm) => {
            return elm.id === node["idLevel0"]
          })[0];
          dep = region.children.filter(elm => {
            return elm.id === node["idLevel1"]
          })[0];
          nodeFind = dep.children.filter(elm => {
            return elm.id === node["idLevel2"]
          })[0];
      }

    }

    return nodeFind;
  }

}
