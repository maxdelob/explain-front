import {
  FlatTreeControl
} from '@angular/cdk/tree';
import {
  Component,
  Injectable
} from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  TerritoriesService
} from '../../providers/territories.service';
import { Administrative } from 'src/app/interfaces/administrative';

interface CustomLoadmoreNode extends LoadmoreNode {
  childrenLoaded: boolean;
}
const LOAD_MORE = 'LOAD_MORE';



export class LoadmoreNode {

  childrenChange = new BehaviorSubject < LoadmoreNode[] > ([]);

  get children(): LoadmoreNode[] {
    return this.childrenChange.value;
  }

  constructor(public item: string,
    public hasChildren = false,
    public loadMoreParentItem: string | null = null) {}
}

/** Flat node with expandable and level information */
export class LoadmoreFlatNode {
  constructor(public item: string,
    public level = 1,
    public expandable = false,
    public loadMoreParentItem: string | null = null

  ) {}
}

/**
 * A database that only load part of the data initially. After user clicks on the `Load more`
 * button, more data will be loaded.
 */
@Injectable()
export class LoadmoreDatabase {
  batchNumber = 5;
  dataChange = new BehaviorSubject < LoadmoreNode[] > ([]);
  nodeMap = new Map < string, LoadmoreNode > ();

  constructor(private territoriesService: TerritoriesService) {}

  /** The data */
  rootLevelNodes: string[] = ['Vegetables', 'Fruits'];
  // dataMap = new Map<string, string[]>([
  //   ['Fruits', ['Apple', 'Orange', 'Banana']],
  //   ['Vegetables', ['Tomato', 'Potato', 'Onion']],
  //   ['Apple', ['Fuji', 'Macintosh']],
  //   ['Onion', ['Yellow', 'White', 'Purple', 'Green', 'Shallot', 'Sweet', 'Red', 'Leek']],
  // ]);

  dataMap = new Map < string, string[] > ();


  initialize() {
    this.territoriesService.getTreeData().subscribe((treeData) => {
      this.dataMap = new Map(treeData);
      const regions = treeData.map(elm => elm[0]); // initialize the tree with region data
      const data = regions.map(name => this._generateNode(name));
      this.dataChange.next(data);
    });
    // const data = this.rootLevelNodes.map(name => this._generateNode(name));
    // this.dataChange.next(data);

  }

  /** Expand a node whose children are not loaded */
  loadMore(item: string, firstTime: boolean, level: number) {
    if (!this.nodeMap.has(item) || !this.dataMap.has(item)) {
      console.log('here 1')
      return;
    }
    const parent = this.nodeMap.get(item)!;
    const children = this.dataMap.get(item)!;
    if (firstTime && parent.children!.length > 0) {
      console.log('here 2')

      return;
    }

    if (firstTime) { // if first time opened load EPCI and Commune from API
      children.forEach((child, index) => {
        this.territoriesService.findByName({ name: child.replace(/'/g, "''"), level}).subscribe((adm: Administrative) => {
            this.territoriesService.getTree(adm.id, 0).subscribe(res => {
              this.dataMap.set(res[0], res[1]);
              if (index + 1 === children.length) {
                const nodes = children.map(name => this._generateNode(name));
                parent.childrenChange.next(nodes);
                this.dataChange.next(this.dataChange.value);
              }
            });
        });
      });


      // const listEPCI = [];
      // console.log(children); // departement
      // children.forEach((child, index) => {
      //   this.territoriesService.getCommunesByDepartements(child).subscribe(res => {
      //     listEPCI.push(res[0]);
      //     if (index + 1 === children.length) { // finished to pass all departements
      //       // console.log(child) 
      //       // console.log(listEPCI);
      //       // this.dataMap.set(child, listEPCI);


      //       // console.log(this.dataMap.get('Ain'));
      //       // const nodes = children.map(name => this._generateNode(name));
      //       // parent.childrenChange.next(nodes);
      //       // this.dataChange.next(this.dataChange.value);
      //     }
      //   });
      // });
    }
  }

  private _generateNode(item: string): LoadmoreNode {
    if (this.nodeMap.has(item)) {
      return this.nodeMap.get(item) !;
    }
    const result = new LoadmoreNode(item, this.dataMap.has(item));
    this.nodeMap.set(item, result);
    return result;
  }
}

/**
 * @title Tree with partially loaded data
 */
@Component({
  selector: 'app-tree-view',
  templateUrl: 'tree-view.component.html',
  styleUrls: ['tree-view.component.scss'],
  providers: [LoadmoreDatabase]
})
export class TreeViewComponent {
  nodeMap = new Map < string, LoadmoreFlatNode > ();
  treeControl: FlatTreeControl < LoadmoreFlatNode > ;
  treeFlattener: MatTreeFlattener < LoadmoreNode, LoadmoreFlatNode > ;
  // Flat tree data source
  dataSource: MatTreeFlatDataSource < LoadmoreNode, LoadmoreFlatNode > ;
  listParentLoaded: string[] = [];

  constructor(private _database: LoadmoreDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);

    this.treeControl = new FlatTreeControl < LoadmoreFlatNode > (this.getLevel, this.isExpandable);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {

      console.log(data);
      this.dataSource.data = data;
    });

    _database.initialize();
  }

  getChildren = (node: LoadmoreNode): Observable < LoadmoreNode[] > => node.childrenChange;

  transformer = (node: LoadmoreNode, level: number) => {
    const existingNode = this.nodeMap.get(node.item);

    if (existingNode) {
      return existingNode;
    }

    const newNode =
      new LoadmoreFlatNode(node.item, level, node.hasChildren, node.loadMoreParentItem);
    this.nodeMap.set(node.item, newNode);
    return newNode;
  }

  getLevel = (node: LoadmoreFlatNode) => node.level;

  isExpandable = (node: LoadmoreFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.expandable;

  isLoadMore = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.item === LOAD_MORE;

  // /** Load more nodes from data source */
  loadMore(item: string) {
    this._database.loadMore(item, true, 1);
  }

  loadChildren(node: LoadmoreFlatNode) {
    this._database.loadMore(node.item, !this.listParentLoaded.includes(node.item), node.level);
    this.listParentLoaded.push(node.item);
  }
}

// initialize() {

//   this.territoriesService.getTreeData().subscribe((treeData) => {
//       // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
//      //     file node as children.
//      const data = this.buildFileTree(treeData, 0);
//      // Notify the change.
//      this.dataChange.next(data);
//   });


// }
