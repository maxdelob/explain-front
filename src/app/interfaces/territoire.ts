export interface Territoire {
    id: string;
    idLevel0: string;
    idLevel1: string;
    idLevel2: string;
    idLevel3: string;
    name: string;
    level: number;
    children: Territoire[];
    isToggled: boolean;
    isExpended: boolean;
    pcode: string;
}
