import { EventDispatcher } from "./event";
export abstract class StorageRW extends EventDispatcher {

    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }
    getLength() {
        return -1
    }
    abstract read(key: string, param?: any): void

    abstract write(key: string, data: any, callback?: (state: number) => void): void

    remove(key: string) {

    }
}

export abstract class BaseStorage {
    //存档的值
    protected value: any;
    //存档的key
    protected key: string;
    //初始值
    protected initValue: any;
    //是否有数据
    protected dataFlag: boolean = true;

    protected _rw: StorageRW;

    protected _param: any;

    static LOCAL_NAME: string = ''

    constructor(key: string, initValue: any, rw: StorageRW) {
        this.key = BaseStorage.LOCAL_NAME + key;
        this.initValue = initValue;
        this._rw = rw;
        this._rw.on(this.key, this.loadValue, this)
    }

    setInitValue(v: any) {
        this.initValue = v;
    }
    /**
     * 是否已经有存档数据
     */
    isHaveData() {
        return this.dataFlag;
    }

    getLength() {
        return this._rw.getLength();
    }

    protected abstract loadValue(localValue: any): void;

    //保存
    saveValue() {
        this._rw.write(this.key, this.value)
    }

    //获取数据
    protected getStorage() {
        this._rw.read(this.key, this._param)
    }
    //获取值
    getValue() {
        return this.value;
    }
    //设置值
    setValue(value: any, save: boolean = true) {
        if (this.value != value) {
            this.value = value;
            if (save) {
                this.saveValue();
            }
        }

    }

    remove(index?: number) {
        this._rw.remove(this.key)
    }


    delete(value: any) {

    }

    removeSelf() {
        this._rw.remove(this.key)
    }

}

export class StorageValue extends BaseStorage {


    protected loadValue(localValue: any) {

        if (localValue != null && localValue != undefined) {
            this.value = localValue;
            this.dataFlag = true
        } else {
            this.value = this.initValue;
            this.dataFlag = false
        }


    }

    getFloat() {
        return parseFloat(this.value)
    }

    getInt() {
        return parseInt(this.value)
    }

    updateValue(value: any) {
        let data = this.getInt() + parseInt(value);
        if (data < 0) {
            data = 0;
        }
        this.setValue(data)
    }
}

export class StorageList extends BaseStorage {
    protected value: any[];

    get(index: number) {
        let data = this.value[index];
        if (data == undefined || data == null) {
            data = this.initValue;
            this.value[index] = data;
        }
        return data;
    }

    getInt(index: number) {
        let value = this.get(index)
        return parseInt(value)
    }

    getFloat(index: number) {
        let value = this.get(index)
        return parseFloat(value)
    }

    updateValue(index: number, value: any) {
        let data = this.getInt(index) + parseInt(value)
        if (data <= 0) {
            data = 0;
        }
        this.set(index, data)
    }

    protected loadValue(localValue: any) {
        if (localValue != null && localValue != undefined) {
            this.value = localValue
            this.dataFlag = true;
        } else {
            this.value = []
            this.dataFlag = false
        }
    }

    size() {
        return this.value.length;
    }

    push(value: any, save: boolean = true) {
        this.value.push(value)
        if (save) {
            this.saveValue()
        }
    }

    set(index: number, value: any, save: boolean = true) {
        if (this.value[index] != value) {
            this.value[index] = value;
            if (save) {
                this.saveValue();
            }
        }

    }

    remove(index: number) {
        if (this.value[index] != undefined) {
            this.value.splice(index, 1)
            this.saveValue();
        }
    }

    delete(obj: any) {
        for (let index = 0; index < this.value.length; index++) {
            const element = this.value[index];
            if (element == obj) {
                this.remove(index)
                break;
            }
        }
    }
}

export class StorageMap extends BaseStorage {
    protected value: { [k: string]: any };
    protected count: number = 0;

    protected loadValue(localValue: any) {
        if (localValue != null && localValue != undefined) {
            this.value = localValue
            for (const key in localValue) {
                if (localValue.hasOwnProperty(key)) {
                    this.count++;
                }
            }
            this.dataFlag = true
        } else {
            this.value = {}
            this.dataFlag = false
        }


    }

    size() {
        return this.count;
    }

    get(key: any) {
        let data = this.value[key];
        if (data == undefined || data == null) {
            data = this.initValue;
            this.value[key] = this.initValue;
        }
        // console.log(' get key ', key, data)
        return data;
    }

    getInt(key: any) {
        let value = this.get(key)
        return parseInt(value)
    }

    getFloat(key: any) {
        let value = this.get(key)
        return parseFloat(value)
    }

    has(key: any) {
        return this.value[key] != undefined && this.value[key] != null
    }

    updateValue(key: any, value: any) {
        let cur = this.getInt(key);
        let temp = parseInt(value)
        let data = cur + temp
        // console.log(' cur ', cur, 'temp ', temp, ' data ', data)
        if (data <= 0) {
            data = 0;
        }
        this.set(key, data)
    }

    set(key: any, value: any, isSave: boolean = true) {
        if (this.value[key] == undefined) {
            this.count++;
        }
        if (this.value[key] != value) {
            this.value[key] = value
        }
        if (isSave)
            this.saveValue();
    }

    remove(key: any) {
        if (this.value[key]) {
            this.count--;
            this.value[key] = null;
            delete this.value[key]
            this.saveValue();
        }

    }
}
