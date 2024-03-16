import { EventDispatcher } from "./event";
import { XlsxData } from "./xlsx";
import { TSMap } from "./struct";
// import { ModuleID } from "../config/ModuleConfig";
export let TYPE_LEN = 1000;
export function getItemType(id: number) {
    return Math.floor(id / TYPE_LEN)
}
/**
 * 未获得
 * 以获得
 * 可获得
 */
export enum ItemState {
    NOT_GET,
    GOT,
    CAN_GET,
    ON_GOING,
}
export class BaseModel extends EventDispatcher {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
            (<any>this).ins.initData()
        }
        return (<any>this).ins;
    }

    initData() {

    }

}
export class SingleModel extends BaseModel {
    private ins: any;

    constructor() {
        super();
        if (!this.ins) {
            this.ins = this;
        }
        return this.ins;
    }
}
export class BaseItemModel extends BaseModel {

    static UPDATE_STATE: string = 'update_item_state'

    // 数量 [0 - 当前 1 - 旧值]
    protected num: number = 0;
    protected preNum: number = 0;
    protected ID: any;//数据表id
    protected type: number;
    //是否已经解锁
    protected state: ItemState;

    protected key: any//唯一标识
    protected _name: string;
    getKey() {

        return this.key;
    }

    setKey(k: any) {
        this.key = k;
    }

    setState(s: ItemState) {
        this.state = s;
        this.emit(BaseItemModel.UPDATE_STATE)
    }

    isOpen() {
        return this.getState() == ItemState.GOT;
    }

    getState() {
        return this.state
    }

    getName() {
        return this._name
    }

    setName(n: string) {
        this._name = n;
    }

    getIcon() {
        return ''
    }

    getDesc() {
        return ''
    }

    getTipDesc() {
        return this.getName()
    }


    setNum(num: number, isDB: boolean = true): boolean {
        let updated = false;

        this.preNum = this.num
        updated = num != this.preNum;

        this.num = num;
        return updated;
    }

    getPreNum() {
        return this.preNum
    }

    getNum(isDB: boolean = true) {
        return this.num;
    }

    getDeltaNum() {
        return this.num - this.preNum;
    }

    getType() {
        return this.type;
    }

    setType(t: number) {
        this.type = t;
    }

    setID(id: any) {
        this.ID = id;
        if (id > TYPE_LEN) {
            this.setType(getItemType(id))
        }
    }

    getID() {
        return this.ID;
    }




    getTime() {
        return -1;
    }


    getScale() {
        return 1;
    }


    getModuleID() {
        return '';
    }

    getSpriteFrame() {
        return ''
    }


}
export class DataItemModel extends BaseItemModel {
    protected fileName: string = ''
    protected data: any[] = null;
    init(id: any, data?: any[], ...param: any) {
        this.setID(id)

        this.data = data;
    }

    //默认ID从1开始的那种才可以调用此函数。
    getIndex() {
        return this.ID - 1;
    }
}
//model 容器 处理配置数据
export class ModelManager<T extends DataItemModel> {

    protected itemMap: TSMap<string | number, T> = new TSMap()
    protected itemList: T[] = []

    protected data: XlsxData;

    protected indexData: TSMap<string, T[]> = new TSMap()

    getData(): XlsxData {
        return this.data;
    }

    getNewModel(id: string | number, type: { new(param?: any): T; }, param?: any) {
        let ins = new type(param);
        let value = this.data.getRowData(id)
        ins.init(id, value)
        return ins;
    }

    getNewModelByKey(id: any, type: { new(): T; }, key: string) {
        let model = this.getNewModel(id, type)
        model.setKey(key)
        return model;
    }
    initWithData(data: XlsxData, type: { new(param?: any): T; }, param?: any) {
        this.data = data;
        if (!this.data) {
            console.warn(' initVithData is null ');
            return;
        }
        data.forEach((key, value: any[]) => {
            let ins = new type(param);
            ins.init(key, value)
            this.itemMap.set(key, ins)
            this.itemList.push(ins)
        })
        // this.itemList = this.itemMap.getArray()
        // cc.log(' this.itemList ',this.itemList.length)
    }

    getIndex(enumValue: number) {
        return this.data.getIndex(enumValue)
    }
    getByIndex(index: number) {
        if (index >= 0 && index <= this.itemList.length - 1) {
            return this.itemList[index]
        }
    }

    getByID(id: string | number) {
        return this.itemMap.get(id)
    }

    size() {
        return this.itemMap.size()
    }


    getList() {
        return this.itemList;
    }

    getMap() {
        return this.itemMap;
    }


    clear() {
        this.data = null;
        this.itemMap.clear()
        this.itemList.length = 0;
    }


    getIndexData(eValue: number, value: any) {
        if (!this.data) {
            console.warn(' getIndexData error ', eValue, value)
            return [];
        }
        let key = eValue + value;
        if (!this.indexData.has(key)) {
            let temp = []
            let list = this.data.getIndexByID(eValue, value)
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                temp.push(this.getByID(element))
            }
            this.indexData.set(key, temp)
        }

        return this.indexData.get(key)
    }

    sortitemList(func: (a: T, b: T) => number) {
        this.itemList.sort(func)
    }

    copy() {
        let list = []
        for (let index = 0; index < this.itemList.length; index++) {
            const element = this.itemList[index];
            list.push(element)
        }
        return list;
    }
}