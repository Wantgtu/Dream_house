
export interface IDAble {

    getID(): number;

    setID(id: number): void;

}

export class TSObject {
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

export class TSRef extends TSObject {
    //使用次数
    protected count: number = 0;

    //获得使用次数
    getCount() {
        return this.count;
    }

    sub() {
        this.count--;
    }

    add() {
        this.count++;
    }
}