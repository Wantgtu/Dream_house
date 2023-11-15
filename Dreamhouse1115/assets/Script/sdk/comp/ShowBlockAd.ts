import SDKManager from "../sdk/SDKManager";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShowBlockAd extends cc.Component {

    @property
    adIndex: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        let rx: number = this.node.x / this.node.parent.width;
        let ry: number = (this.node.parent.height - this.node.y) / this.node.parent.height
        SDKManager.getChannel().showBlockAd(this.adIndex, rx, ry)
    }

    onDestroy() {
        SDKManager.getChannel().hideBlockAd(this.adIndex)
    }

    // update (dt) {}
}
