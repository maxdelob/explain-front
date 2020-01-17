import {  Territoire  } from '../app/interfaces/territoire';
  
  const fakeCommun: Territoire = {
  id: '0001',
  name: "villepreux",
  level: 3,
  children: [],
  isToggled: true,
  isExpended: false,
  pcode: "FREPCI200067460",
  idLevel0: '43918',
  idLevel1: '43919',
  idLevel2: '43920'
  }

 const epci: Territoire = {
  id: '43920',
  name: "CC Loudéac Communauté - Bretagne Centre",
  level: 2,
  children: [fakeCommun],
  isToggled: false,
  isExpended: false,
  pcode: "FREPCI200067460",
  idLevel0: '43918',
  idLevel1: '43919',
  idLevel2: '43920'
};

  const dep1: Territoire = {
    "idLevel0": '43918',
    "idLevel1": '43919',
    "name": "Côtes-d'Armor",
    "id": '43919',
    "level": 1,
    "isToggled": false,
    "isExpended": false,
    "pcode": "FRDEPA22",
    "children": [epci],
  };
  
  const dep2: Territoire = {
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
  
  const dep3: Territoire = {
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
  
  const dep4: Territoire = {
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
  
  
  const region : Territoire= {
    "idLevel0": '43918',
    "name": "Bretagne",
    "id": '43918',
    "level": 0,
    "isToggled": false,
    "isExpended": false,
    "pcode": "FRREGI53",
    "children": [dep1, dep2, dep3, dep4]
  }
  
  
  export const bretagne: Territoire[] = [{
    "name": "France",
    "id": "36357",
    "level": -1,
    "isExpended": false,
    "isToggled": false,
    "children": [region],
    "pcode": "PAYSFR"
  }];
  