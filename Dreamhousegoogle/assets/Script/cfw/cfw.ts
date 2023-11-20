import { EventDispatcher } from "./event";
import { XlsxDataManager, XlsxData } from "./xlsx";
import { LocalManager } from "./local";
import { DataItemModel } from "./model";
export class DataModel extends DataItemModel {

    protected fileName: string = ''
    constructor(name: string) {
        super();
        this.fileName = name;
    }

    setFileName(name: string) {
        this.fileName = name;
    }


    getFileName() {
        return this.fileName;
    }



    setValue(index: number, value: any, isSave: boolean = true) {
        DataManager.instance().setValue(this.fileName, this.ID, index, value, isSave)
        this.emit(this.getEventKey(index), value)
    }

    getCfgValue(index: number) {
        return DataManager.instance().getCfgValue(this.fileName, this.ID, index)
    }

    getValue(index: number, initValue?: any) {
        return DataManager.instance().getValue(this.fileName, this.ID, index, initValue)
    }

    saveValue(index: number) {
        DataManager.instance().saveDBValue(this.fileName, this.ID, index)
    }

    getEventKey(index: number) {
        return this.fileName + this.ID + index
    }


    static getNewModel<T extends DataModel>(id: string, type: { new(): T; }) {
        let ins = new type();
        ins.init(id)
        return ins;
    }

    static getNewModelByKey<T extends DataModel>(id: string, type: { new(): T; }) {
        let model = this.getNewModel(id, type)
        model.setKey(Date.now() + id)
        return model;
    }
}

export default class DataManager extends EventDispatcher {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
            (<any>this).ins.initData()
        }
        return (<any>this).ins;
    }

    protected config: XlsxDataManager;

    protected db: LocalManager;


    initData() {
        this.config = XlsxDataManager.instance();
        this.db = LocalManager.instance();
    }

    getRowData(name: string, key: string) {
        let data = this.config.get(name)
        if (data) {
            return data.getRowData(key)
        } else {
            return this.db.getRowData(name, key)
        }
    }


    getList(name: string) {
        let data = this.config.get(name)
        if (data) {
            return data.getData()
        } else {
            return this.db.getData(name)
        }
    }

    getCfgValue(name: string, ID: string, index: number) {
        let data: XlsxData = this.config.get(name)
        if (data) {
            let v: any = data.getValue(ID, index)
            return v;
        }
        return null;
    }

    /**
     * 
     * @param name 配置表的名称
     * @param key 唯一标识
     * @param index 值是索引 因为配置表做了优化，所以需要用索引取值
     */
    getValue(name: string, ID: string, index: number, initValue?: any) {
        let data: XlsxData = this.config.get(name)
        //所有存当数据与数据表挂钩
        if (data) {
            // console.log(' getValue name ', name, ' id ', ID, ' index ', index, initValue)
            let dbName: string = data.getDBName(index)
            let v: any = data.getValue(ID, index)
            // console.log(' dbName ', dbName)
            if (dbName) {
                let key: string = data.getName(index)
                let value = this.getDBValue(dbName, ID, key, v)
                // console.log(' key ', key, value)
                // if (value != undefined && value != null) {
                return value
                // } else {
                //     if (initValue != undefined) {
                //         return initValue;
                //     }
                // }
            }
            return v
        } else {
            return this.getDBValue(name, ID, index, initValue)
        }
    }


    setValue(name: string, ID: string, index: number, value: number, isSave: boolean = true) {
        let data: XlsxData = this.config.get(name)
        if (data) {
            let dbName: string = data.getDBName(index)
            if (dbName) {
                let key: string = data.getName(index)
                this.setDBValue(dbName, ID, key, value, isSave)
            }
        } else {
            this.setDBValue(name, ID, index, value, isSave)
        }
        this.emit(this.getEventKey(name, ID, index), value)
    }

    saveDBValue(name: string, ID: string, index: number) {
        this.db.saveData(name)
    }

    setDBValue(dbName: string, ID: string, key: any, value: any, isSave: boolean = true) {
        this.db.setValue(dbName, ID, key, value, isSave)
        this.emit(dbName + ID + key, value)
    }

    getDBValue(dbName: string, ID: string, key: any, initValue?: any) {
        let value = this.db.getValue(dbName, ID, key, initValue)
        return value;
    }

    getEventKey(name: string, ID: string, index: number) {
        return name + ID + index
    }
}