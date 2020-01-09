import { Territoire } from 'src/app/interfaces/territoire';

const child1: Territoire = {
  "idLevel0": '43918',
  "idLevel1": '43919',
  "name": "Côtes-d'Armor",
  "id": '43919',
  "level": 1,
  "isToggled": false,
  "isExpended": false,
  "pcode": "FRDEPA22",
  "children": [],
};


const child2: Territoire = {
  "idLevel0": '43918',
  "idLevel1": '47018',
  "name": "Finistère",
  "id": '47018',
  "level": 1,
  "isToggled": false,
  "isExpended": false,
  "pcode": "FRDEPA29",
  "children": [],
};

const child3: Territoire = {
  "idLevel0": '43918',
  "idLevel1": '50070',
  "name": "Ille-et-Vilaine",
  "id": '50070',
  "level": 1,
  "isToggled": false,
  "isExpended": false,
  "pcode": "FRDEPA35",
  "children": []
};

const child4: Territoire = {
  idLevel0: '43918',
  idLevel1: '57702',
  name: "Morbihan",
  id: '57702',
  level: 1,
  isToggled: false,
  isExpended: false,
  pcode: "FRDEPA56",
  children: []
}

export const children = [child1, child2, child3, child4];