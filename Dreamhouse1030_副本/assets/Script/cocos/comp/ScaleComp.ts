// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScaleComp extends cc.Component {


    @property
    duration: number = 0.5;

    @property
    scale: number = 0.5;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

        cc.tween(this.node).repeatForever(
            cc.tween(this.node).by(this.duration, { scale: this.scale }).by(this.duration, { scale: -this.scale })
        ).start();


    }

    // update (dt) {}
}
