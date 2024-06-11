import { XlsxData } from "./xlsx";
import Utils from "./tools/Utils";
import Component3D from "../engine/Component3D";


export enum ThinkType {
    CONTINUE,//继续想
    ACTION, // 做事情
}

export enum Ai_dataEnum {
    condition,
    cParam,
    conditionYes,
    parm1,
    conditionNo,
    parm2

}
export interface ChangeStateAble {

    changeAction(s: number, param?: any): void

    getSimulator(): any;
}
export class AIManager extends Component3D {
    protected target: ChangeStateAble;
    protected perception: Perception;

    setTarget(t: ChangeStateAble) {
        this.target = t;
    }
    setPerception(perception: Perception) {
        this.perception = perception;
    }

    checkPerception(perceptionType: number, value?: any) {
        return this.perception.action(this.target, perceptionType, value)
    }

    getPerception() {
        return this.perception;
    }


    think(decisionID: number) {

    }

}
export class Perception {


    // protected simulator: any;
    protected step: any = {};
    // setSimulator(s: any) {
    //     this.simulator = s;
    // }

    // getSimulator() {
    //     return this.simulator;
    // }

    action(self: ChangeStateAble, type: number, param?: any) {
        return true;
    }

}

export class DecisionTree extends AIManager {



    protected decisionData: XlsxData;

    constructor() {
        super()
    }

    setData(data: XlsxData) {
        this.decisionData = data;
    }




    action(target: ChangeStateAble, decisionID: number) {
        let data = this.decisionData.getRowData(decisionID)
        let flag = false;
        if (data) {
            let perceptionType = data[Ai_dataEnum.condition];
            let type = 0;
            let id: number[] = null;
            flag = this.perception.action(target, perceptionType, data[Ai_dataEnum.cParam])
            if (flag) {
                type = data[Ai_dataEnum.conditionYes]
                id = data[Ai_dataEnum.parm1]
            } else {
                type = data[Ai_dataEnum.conditionNo]
                id = data[Ai_dataEnum.parm2]
            }
            this.judge(type, id)
        } else {
            console.error(' DecisionTree action  data is null decisionID ', decisionID)
        }
        return flag;
    }

    private judge(type: ThinkType, param: number[]) {
        if (type == ThinkType.ACTION) {
            this.doLogic(param)
        } else {
            for (let index = 0; index < param.length; index++) {
                const element = param[index];
                if (this.action(this.target, element)) {
                    break;//目前仅支持串行，不支持并行。如需支持并行，需要添加是否拦截字段。
                }
            }
        }
    }

    // 50 30 20 : 80 
    private doLogic(param: number[]) {
        if (param.length > 0) {
            let r = Utils.random(0, 100);
            let count = param.length / 2
            for (let index = 0; index < count; index++) {
                let behaveType: number = param[index * 2]
                let random: number = param[index * 2 + 1]
                //
                if (r <= random) {
                    this.target.changeAction(behaveType)
                    return;
                }
            }
        }


    }

    think(decisionID: number) {
        this.action(this.target, decisionID)
    }
}