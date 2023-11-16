
import { engine } from "../engine/engine";
import { EventDispatcher } from "./event";
export class UIEvent {

    static POP_VIEW = 'UI_POP_VIEW'
}
export enum UIType {
    SINGLE,
    STACK,
    QUEUE,
}

export type UIItem = { uiType: UIType, zIndex: number, canPop: boolean }


class LayerManager {

    //根节点
    protected root: any;

    //层级管理器的类型
    protected uiType: UIType = UIType.SINGLE;

    //管理对象的列表
    protected list: LayerInterface[]

    //跟管理器的内容是否可以被弹出
    protected popFlag: boolean = false;

    //管理器的层级
    protected zOrder: number = 1;

    constructor(uiType: UIType, zOrder: number = 1, canPop: boolean = true) {
        this.list = []
        this.uiType = uiType;
        this.zOrder = zOrder;
        this.popFlag = canPop;
    }

    init(node: any) {
        this.root = node;
    }

    setZOrder(order: number) {
        this.zOrder = order;
    }

    getZOrder(): number {
        return this.zOrder;
    }

    canPop() {
        return this.popFlag;
    }

    isValid() {
        return engine.isValid(this.root)
    }

    count() {
        return this.list.length;
    }

    /**
     * 设置整个管理器内的ui是否可见
     * @param flag 
     */
    setVisible(flag: boolean) {
        for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            element.setVisible(flag)
        }
    }

    has(layer: LayerInterface) {
        for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            if (layer === element) {
                return true;
            }
        }
        return false;
    }

    /**
     * 根据名称判断是否有某个UI。
     */
    hasView(name: string) {
        for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            if (element && name == element.getName()) {
                return true;
            }
        }
        return false;
    }

    hasViewByPath(path: string) {
        // console.log(' path ', path)
        for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            // console.log('hasViewByPath  path ', element.getPath())
            if (element && path == element.getPath()) {
                return true;
            }
        }
        return false;
    }

    /**
     * 删除指定名称的UI，有可能有多个指定名称的UI。
     * 如果删除指定的UI，可以使用removeView
     */
    remove(name: string) {
        for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            if (name == element.getName()) {
                this.list.splice(index, 1)
                element.exit()
                break;
            }
        }
    }

    //添加layer
    pushView(view: LayerInterface): void {
        switch (this.uiType) {
            case UIType.STACK:
                this.list.push(view);
                this.show(view)
                break;
            case UIType.QUEUE:
                this.list.push(view);

                if (this.list.length == 1) {
                    this.show(view);
                }
                break;
            case UIType.SINGLE:
                this.popView(null)
                this.list.push(view);
                this.show(view)

                break;
        }
    }

    // 移除layer
    popView(view: LayerInterface): boolean {
        switch (this.uiType) {
            case UIType.STACK:
                if (!view) {
                    if (this.list.length > 0) {
                        let layerInfo = this.list.pop();
                        layerInfo.exit();
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return this.removeView(view);
                }
            case UIType.QUEUE:

                if (!view) {
                    console.log("this.list.length 111 ", this.list.length)
                    if (this.list.length > 0) {
                        let layerInfo = this.list.shift();
                        layerInfo.exit();
                        if (this.list.length > 0) {
                            this.show(this.list[0]);
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    console.log("this.list.length 222 ", this.list.length)
                    let flag = this.removeView(view);
                    if (this.list.length > 0) {
                        this.show(this.list[0]);
                    }
                    return flag
                }
            case UIType.SINGLE:
                if (this.list.length > 0) {
                    let layerInfo = this.list.shift();
                    layerInfo.exit();
                    return true;
                } else {
                    return false;
                }
        }
    }

    show(view: LayerInterface) {
        view.setOrder(this.zOrder);
        this.root.addChild(view.getNode())
    }
    //删除指定位置的layer
    removeView(layer: LayerInterface): boolean {
        // logInfo(' LayerManger removeView ')
        let index = this.list.indexOf(layer)
        if (index >= 0) {
            this.list.splice(index, 1);
            layer.exit();
            return true;
        }
        return false;
    }

    addView(view: LayerInterface) {
        this.list.push(view)
    }

    clear() {
        // logInfo(' LayerManger clear ')
        for (let index = 0; index < this.list.length; index++) {
            const element: LayerInterface = this.list[index];
            element.exit();
        }
        this.list.length = 0;
    }
}



export interface LayerInterface {

    exit(): void;

    setVisible(f: boolean): void;

    setOrder(order: number): void;

    setUIIndex(t: number): void;

    getUIIndex(): number;

    getNode(): any;

    isLoad(): boolean;

    getName(): string;

    addToParent(parent: any): void

    setPath(p: string)

    getPath()
}

export default class UIManager extends EventDispatcher {

    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }

    private managers: LayerManager[] = [];

    private root: any;

    getRoot() {
        return this.root;
    }


    constructor() {
        super();
        this.managers = [];
    }


    /**
     * 隐藏底层UI,减少显示对象个数
     * @param uiIndex 
     * @param flag 
     */
    setVisible(uiIndex: number, flag: boolean) {
        // logInfo('setVisible ', uiIndex, flag)
        this.managers[uiIndex].setVisible(flag)
    }

    init(node: any, config: UIItem[]) {
        this.managers = [];
        this.root = node
        for (let i = 0; i < config.length; i++) {
            let vaule: UIItem = config[i];
            let layer = new LayerManager(vaule.uiType, vaule.zIndex, vaule.canPop);
            this.setManager(i, layer)
        }

    }


    setManager(index: number, manager: LayerManager) {
        this.managers[index] = manager;
        this.managers[index].init(this.root)
    }


    removeView(name: string, index: number) {
        let manager = this.managers[index]
        if (manager) {
            manager.remove(name)
        }
    }

    /**
     * 清除UI
     */
    clear() {
        for (let index = this.managers.length - 1; index >= 0; index--) {
            const manager = this.managers[index];
            manager.clear()
        }
    }

    popAll() {
        for (let index = this.managers.length - 1; index >= 1; index--) {
            const manager = this.managers[index];
            manager.clear()
        }
    }

    /**
     * 用于在启动页的时候直接将节点放入管理器。实际场景中
     * 已经加载了该节点。
     * @param layer 
     * @param uiIndex 
     */
    addView(layer: LayerInterface, uiIndex: number) {
        if (layer) {
            let manager = this.managers[uiIndex];
            if (!manager) {
                console.log(' manager is null ', layer)
                return;
            }
            if (manager.isValid()) {
                manager.addView(layer);
            }
        }
    }

    //添加UI
    pushView(layer: LayerInterface) {
        if (layer) {
            let uiIndex = layer.getUIIndex()
            let manager = this.managers[uiIndex];
            if (!manager) {
                console.log(' manager is null ', layer)
                return;
            }
            if (manager.isValid()) {
                // layer.setUIIndex(uiIndex)
                manager.pushView(layer);
                this.getOpenUICount();
            }

        }
    }

    hasView(name: string, uiIndex: number) {
        let manager = this.managers[uiIndex];
        if (manager) {
            return manager.hasView(name)
        }
        return false;
    }

    hasViewByPath(path: string, uiIndex: number) {
        let manager = this.managers[uiIndex];
        if (manager) {
            return manager.hasViewByPath(path)
        }
        return false;
    }



    /**
     * 此方法用于关闭界面，为了兼容Android的back键 所以layer有为null的情况。
     * 如果 返回false 表明已经没有界面可以弹出
     * @param layer 
     */
    popView(layer?: LayerInterface) {
        // console.log('popView layer is ', layer)
        if (layer) {
            let index: number = layer.getUIIndex()
            // console.log(' popView  index is ', index, ' layer is ', layer)
            let manger = this.managers[index];
            if (!manger) {
                // console.log(' popView layer is not found type is ', type)
            } else {
                manger.popView(layer);
            }
        } else {
            for (let index = this.managers.length - 1; index >= 0; index--) {
                const manager = this.managers[index];
                if (manager.canPop() && manager.count() > 0) {
                    if (manager.popView(null)) {
                        break;
                    }
                }
            }
        }
        this.emit(UIEvent.POP_VIEW, this.getOpenUICount())


    }


    getOpenUICount() {
        let count: number = 0;
        for (let index = this.managers.length - 1; index >= 0; index--) {
            const manager = this.managers[index];
            if (manager.canPop()) {
                count += manager.count()
            }
        }
        return count;
    }

}

export class SceneManager {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }

    private isLoading: boolean = false;

    private sceneName: string = ''

    protected managers: UIManager[] = []

    init(node: any, config: UIItem[], index: number = 0) {
        if (!this.managers[index]) {
            this.managers[index] = new UIManager()
            this.managers[index].init(node, config)
        }
    }

    //添加UI
    pushView(layer: LayerInterface, index: number) {
        if (layer && this.managers[index]) {
            this.managers[index].pushView(layer)
        }
    }

    hasView(name: string, uiIndex: number, index: number) {
        if (name && this.managers[index]) {
            this.managers[index].hasView(name, uiIndex)
        }
    }

    popView(layer?: LayerInterface, index: number = 0) {
        if (this.managers[index]) {
            this.managers[index].popView(layer)
        }
    }

    clear(index: number = 0) {
        if (this.managers[index]) {
            this.managers[index].clear()
        }
    }

    getSceneName() {
        return this.sceneName;
    }

    runScene(asset: any, config: UIItem[], index: number = 0) {
        let scene = asset.scene;
        let node = engine.getChildByName(scene, "Canvas");
        if (node) {
            this.init(node, config, index)
        }
        engine.runScene(scene)
    }

    loadScene(sceneName: string, callback: (err: any, r?: any) => void, config: UIItem[], index: number = 0) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        engine.loadScene(sceneName, (error: any, scene: any) => {
            this.isLoading = false;
            if (error) {
                console.log("enterScene  error  ", error);
                return;
            }

            // self.publish(UIManager.CHANGE_SCENE,sceneName);
            let node = scene.getChildByName("Canvas");
            if (node) {
                this.init(node, config, index)
                callback(null, node);
            } else {
                callback("UIManager enterScene error component is null " + sceneName);
            }
        });
    }

}
