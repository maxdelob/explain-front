/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable} from 'rxjs';

import {
  TerritoriesService
} from '../providers/territories.service';
import { Administrative } from 'src/app/interfaces/administrative';

const LOAD_MORE = 'LOAD_MORE';

/** Nested node */
export class LoadmoreNode {
  childrenChange = new BehaviorSubject<LoadmoreNode[]>([]);

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
              public loadMoreParentItem: string | null = null) {}
}

/**
 * A database that only load part of the data initially. After user clicks on the `Load more`
 * button, more data will be loaded.
 */
@Injectable()
export class LoadmoreDatabase {
  batchNumber = 5;
  dataChange = new BehaviorSubject<LoadmoreNode[]>([]);
  nodeMap = new Map<string, LoadmoreNode>();
  constructor(private territoriesService: TerritoriesService) {}

  /** The data */
  rootLevelNodes: string[] = ['Vegetables', 'Fruits'];
  dataMap = new Map<string, string[]>([
    ['Fruits', ['Apple', 'Orange', 'Banana']],
    ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    ['Apple', ['Fuji', 'Macintosh']],
    ['Onion', ['Yellow', 'White', 'Purple', 'Green', 'Shallot', 'Sweet', 'Red', 'Leek']],
  ]);

  initialize() {
    this.territoriesService.getTreeData().subscribe((treeData) => {
      this.dataMap = new Map(treeData);
      const regions = treeData.map(elm => elm[0]); // initialize the tree with region data
      const data = regions.map(name => this._generateNode(name));
      this.dataChange.next(data);
    });
  }

  /** Expand a node whose children are not loaded */
  loadMore(item: string, onlyFirstTime = false, level) {
    if (!this.nodeMap.has(item) || !this.dataMap.has(item)) {
      return;
    }
    const parent = this.nodeMap.get(item)!;
    const children = this.dataMap.get(item)!;
    if (onlyFirstTime && parent.children!.length > 0) {
      return;
    }

    
    const newChildrenNumber = parent.children!.length + this.batchNumber;


    children.forEach((child, index) => {
      this.territoriesService.findByName({ name: child.replace(/'/g, "''"), level}).subscribe((adm: Administrative) => {
          this.territoriesService.getTree(adm.id, 0).subscribe(res => {
            this.dataMap.set(res[0], res[1]);
            if (index + 1 === children.length) {
              const nodes = children.slice(0, newChildrenNumber).map(name => this._generateNode(name));
              if (newChildrenNumber < children.length) {
                // Need a new load more node
                nodes.push(new LoadmoreNode(LOAD_MORE, false, item));
              }
              parent.childrenChange.next(nodes);
              this.dataChange.next(this.dataChange.value);
            }
          });
      });
    });




   
  }

  private _generateNode(item: string): LoadmoreNode {
    if (this.nodeMap.has(item)) {
      return this.nodeMap.get(item)!;
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
  selector: 'tree-loadmore-example',
  templateUrl: 'tree-loadmore-example.component.html',
  styleUrls: ['tree-loadmore-example.component.scss'],
  providers: [LoadmoreDatabase]
})
export class TreeLoadmoreExample {
  nodeMap = new Map<string, LoadmoreFlatNode>();
  treeControl: FlatTreeControl<LoadmoreFlatNode>;
  treeFlattener: MatTreeFlattener<LoadmoreNode, LoadmoreFlatNode>;
  // Flat tree data source
  dataSource: MatTreeFlatDataSource<LoadmoreNode, LoadmoreFlatNode>;
  listParentLoaded = [];

  constructor(private _database: LoadmoreDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);

    this.treeControl = new FlatTreeControl<LoadmoreFlatNode>(this.getLevel, this.isExpandable);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    _database.initialize();
  }

  getChildren = (node: LoadmoreNode): Observable<LoadmoreNode[]> => node.childrenChange;

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

  /** Load more nodes from data source */
  loadMore(node: LoadmoreFlatNode) {
    this._database.loadMore(node.item, !this.listParentLoaded.includes(node.item), node.level);
    this.listParentLoaded.push(node.item);

  }

  loadChildren(node: LoadmoreFlatNode) {
    this._database.loadMore(node.item, !this.listParentLoaded.includes(node.item), node.level);
    this.listParentLoaded.push(node.item);

  }
}


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */