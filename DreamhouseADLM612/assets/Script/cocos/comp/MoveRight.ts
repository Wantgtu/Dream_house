import TweenMgr from "../TweenMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoveRight extends cc.Component {


    onLoad() {
        let size = cc.view.getVisibleSize();
        this.node.x = -size.width;
        TweenMgr.moveRight(this.node, 0.2, 0)
    }

    // update (dt) {}
}
