import { StorageRW, StorageValue, StorageList, StorageMap } from "./storage";
import StorageHelper from "./tools/StorageHelper";
import { EventDispatcher } from "./event";

export class LocalRW extends StorageRW {

    constructor() {
        super()
    }

    remove(key: string) {
        StorageHelper.remove(key)
    }

    getLength() {
        return StorageHelper.getLength()
    }

    read(key: string): void {
        try {
            let data = StorageHelper.getJsonBase64(key)
            this.emit(key, data)
        } catch (error) {
            this.emit(key, null)
        }
    }

    write(key: string, data: any, callback?: (state: number) => void): void {
        StorageHelper.setJsonBase64(key, data)
    }

    removeSelf(key: string) {
        StorageHelper.remove(key)
    }
}
export class LocalValue extends StorageValue {
    constructor(key: string, initValue: any) {
        super(key, initValue, LocalRW.instance())
        this.getStorage()
    }
}
export class LocalList extends StorageList {

    constructor(key: string, initValue: any) {
        super(key, initValue, LocalRW.instance())
        this.getStorage()
    }

}

export class LocalMap extends StorageMap {

    constructor(key: string, initValue: any) {
        super(key, initValue, LocalRW.instance())
        this.getStorage()
    }

}
/**
 * 一张表对应一个本地存储，以免读取次数太多
 * 造成性能浪费
 */
export class LocalManager extends EventDispatcher {

    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }


    protected storage: { [k: string]: LocalMap } = {}

    remove(name: string) {
        let data: LocalMap = this.storage[name]
        if (data) {
            this.storage[name] = null;
        }
    }

    getData(name: string): LocalMap {
        let data: LocalMap = this.storage[name]
        if (!data) {
            data = new LocalMap(name, null)
            this.storage[name] = data;
        }
        return data;
    }

    getRowData(name: string, key: any) {
        let data: LocalMap = this.storage[name]
        if (!data) {
            return null;
        }
        let obj = data.get(key)
        if (obj) {
            return obj[key]
        }
        return null;
    }


    saveData(name: string) {
        let data: LocalMap = this.getData(name)
        data.saveValue()
    }

    getValue(name: string, ID: string, key: number | string, initValue: any = 0) {
        let data: LocalMap = this.getData(name)
        // console.log('getValue getValue name ',name,ID,key,initValue,data)
        let obj = data.get(ID)

        if (obj == null) {
            obj = {}

        }
        if (obj[key] == undefined || obj[key] == null) {
            obj[key] = initValue;
        }
        return obj[key]
    }

    setValue(name: string, ID: string, key: number | string, value: any, isSave: boolean) {
        let data: LocalMap = this.getData(name)
        if (data) {
            let obj = data.get(ID)
            if (obj == null) {
                obj = {}
            }
            obj[key] = value;
            data.set(ID, obj, isSave)
        }
    }
}

