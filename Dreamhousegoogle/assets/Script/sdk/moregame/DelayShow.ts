// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DelayShow extends cc.Component {



    @property
    time: number = 0.5;


    start() {
        this.node.opacity = 0;
        cc.tween(this.node).delay(this.time).call(() => {
            this.node.opacity = 255;
        }).start();
    }

    // update (dt) {}
}
