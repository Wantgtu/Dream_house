import { ResItem, ResType } from "../cfw/res";
import { ModuleManager } from "../cfw/module";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EngineView extends cc.Component {


    private uiIndex: number = 0;

    protected loadFlag: boolean = false;

    isLoad() {
        return this.loadFlag
    }

    onLoad() {
        this.loadFlag = true;
        this.onEnter()
    }
    onEnter() {

    }

    onDestroy() {
        this.onExit()
    }

    onExit() {

    }
    getName() {
        return this.node.name;
    }


    exit() {
        this.node.destroy()
    }

    setVisible(f: boolean): void {
        this.node.active = f;
    }

    setOrder(order: number): void {
        this.node.zIndex = order;
    }
    setUIIndex(t: number): void {
        this.uiIndex = t;
    }

    getUIIndex(): number {
        return this.uiIndex
    }

    getNode() {
        return this.node;
    }

    setTimeout(func: Function, time: number) {
        let t = cc.tween(this.node).delay(time / 1000).call(() => {
            func();
        }).start()
        return t;
    }

    clearTimeout(t: cc.Tween) {
        t.stop()
    }

    setInterval(func: Function, time: number) {
        let t = cc.tween(this.node).repeatForever(
            cc.tween(this.node).delay(time / 1000).call(() => {
                func();
            })
        ).start();
        return t;
    }

    clearInterval(t: cc.Tween) {
        t.stop()
    }

    addToParent(parent: cc.Node) {
        // console.log(' param.parent ', parent)
        this.node.parent = parent;
    }

    setSpriteAtlas(sprite: cc.Sprite, moduleID: string, path: string, name?: string) {
        // console.log('setSpriteAtlas  name ', name, ' path ', path, ' moduleID ', moduleID)
        if (name) {
            ModuleManager.loadRes(moduleID, path, ResType.SpriteAtlas, (err: any, item: ResItem) => {
                if (err || !cc.isValid(this.node)) {
                    return
                }
                let atlas: cc.SpriteAtlas = item.getRes();
                sprite.spriteFrame = atlas.getSpriteFrame(name)

            })
        } else {
            this.setSpriteFrame(sprite, moduleID, path)
        }

    }

    setSpriteFrame(sprite: cc.Sprite, moduleID: string, path: string) {
        ModuleManager.loadRes(moduleID, path, ResType.SpriteFrame, (err: any, item: ResItem) => {
            if (err || !cc.isValid(this.node)) {
                return
            }
            sprite.spriteFrame = item.getRes();

        })
    }

    changePosition(node: cc.Node) {
        let p = node.getPosition();
        let pos = node.parent.convertToWorldSpaceAR(p)
        let p3 = this.node.convertToNodeSpaceAR(pos);
        return p3
    }

    update(dt: number) {
        this.updateLogic()
    }

    updateLogic() {

    }

}