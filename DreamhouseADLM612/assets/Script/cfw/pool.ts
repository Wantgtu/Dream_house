import { TSMap } from "./struct";

export interface IPool {
    get(func: () => any): any;
    size(): number;
    put(obj: any, flag?: boolean): void;
    clear(): void;
    init(key: string, func: () => any, count: number): void

}
export interface KeyAble {


    getKey(): string | number;

    setKey(key: string | number): void;


}

export class ObjectPool implements IPool {

    private buffList: any[] = []

    private key: string;


    init(key: string, func: () => any, count: number): void {
        this.key = key;
        for (let index = 0; index < count; index++) {
            const element = func();
            this.put(element)
        }
    }

    get(func: () => any) {
        let item = this.buffList.length > 0 ? this.buffList.shift() : func();
        return item;
    }

    put(obj: any) {
        this.buffList.push(obj)
    }

    size() {
        return this.buffList.length
    }

    destroy() {
        this.buffList.length = 0;

    }

    clear() {
        this.buffList.length = 0;
    }
}

export class PoolManager {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }


    private map: TSMap<string, ObjectPool> = new TSMap();

    init(key: any, func: () => any, count: number): void {
        if (!this.map.has(key)) {
            this.map.set(key, new ObjectPool())
        }
        this.map.get(key).init(key, func, count)
    }

    get(key: any, func: () => any) {
        if (!this.map.has(key)) {
            this.map.set(key, new ObjectPool())
        }
        return this.map.get(key).get(func)
    }

    put(key: any, obj: any) {
        if (!this.map.has(key)) {
            this.map.set(key, new ObjectPool())
        }
        this.map.get(key).put(obj)
    }

    size(key: string) {
        if (this.map.has(key)) {
            return this.map.get(key).size()
        }
        return 0;
    }


    destroy() {
        this.map.forEach((key, value) => {
            value.destroy();
        })
        this.map.clear();
    }


}

export class TSPoolManager {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }


    init<T extends KeyAble>(key: string, type: { new(): T; }, count: number = 1): void {
        PoolManager.instance().init(key, () => {
            return new type();
        }, count)
    }
    /**
     * 获得被销毁的对象
     * @param key 
     */
    get<T extends KeyAble>(key: string, type: { new(): T; }): T {
        return PoolManager.instance().get(key, () => {
            return new type()
        })
    }

    put(instance: KeyAble) {
        PoolManager.instance().put(instance.getKey(), instance)
    }
}