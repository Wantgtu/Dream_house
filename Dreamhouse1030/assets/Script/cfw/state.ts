
import Component3D from "../engine/Component3D";
export interface ActionComplete {
    actionComplete(): void;
}

export class GameState extends Component3D {
    protected state: number = 0;

    protected preState: number = -1;

    //每个状态存储的数据
    protected data: any[] = []

    /**
     * 行动开始
     * @param s 
     * @param param 
     */
    changeState(s: number, param?: any): void {
        this.endState(param)
        this.preState = this.state;
        this.setState(s);
        this.beginState(param)
    }

    getPreState() {
        return this.preState;
    }

    beginState(param?: any) {

    }


    endState(param?: any) {

    }


    setState(s: number) {
        this.state = s;
    }

    getState() {
        return this.state;
    }

    //行动更新,
    /**
     * 每帧更新
     * @param dt 每帧间隔时间 
     * @param s 状态
     * @param param 附加参数
     */
    updateState(dt: number, param?: any): void {

    }

}

export interface Destroy {
    destroy(): void;
}
/**
 * cgw 20200923
 * 对象管理器，可以做为对象池使用。
 */
export class NPCManager<T extends Destroy> {

    protected npcList: T[] = []

    protected removeList: T[] = []

    protected buffer: T[] = []

    /**
     * 添加
     * @param item 
     */
    push(item: T) {
        this.npcList.push(item)
    }

    /**
     * 移除，为了不破坏迭代器，不会马上从数组中移除
     * 而且先缓存到另一个数组中
     * @param item 
     */
    remove(item: T) {
        this.removeList.push(item)
    }

    /**
     * 回收对象
     */
    recover() {
        while (this.removeList.length > 0) {
            let item = this.removeList.shift()
            this.delete(item)
        }
    }

    recoverAll() {
        for (let index = 0; index < this.npcList.length; index++) {
            const element = this.npcList[index];
            this.buffer.push(element)
        }
        this.npcList.length = 0;
    }

    delete(item: T) {
        let index = this.npcList.indexOf(item)
        if (index >= 0) {
            this.buffer.push(item)
            this.npcList.splice(index, 1)
        }
    }

    getByIndex(index: number) {
        return this.npcList[index]
    }

    /**
     * 获取一个对象
     * @param func 
     */
    get(func: () => T) {
        // console.log(' this.buffer.length ', this.buffer.length)
        let item = this.buffer.length > 0 ? this.buffer.shift() : func()
        return item;
    }

    /**
     * 获取所有对象
     */
    getList() {
        return this.npcList;
    }

    size() {
        return this.npcList.length;
    }

    get length() {
        return this.size()
    }

    clear() {
        for (let index = 0; index < this.buffer.length; index++) {
            const element = this.buffer[index];
            element.destroy();
        }
        this.buffer.length = 0;
    }

}

export class SimpleActionManager extends GameState {


    //行动对象
    protected target: any;

    setTarget(t: any) {
        this.target = t;
    }

    //行为初始化
    init(s: number, param?: any): void { }

    getAction() {
        return this.getState();
    }
    /**
     * 每次动画结束时调用
     * @param s 
     */
    onActionFinish() {

    }

    isActionFinish() {
        return false;
    }


    //行动结束，告知行动对象可以思考了。
    complete() {

    }



}





