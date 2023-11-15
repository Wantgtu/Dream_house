export default class TweenMgr {


    static moveRight(node: cc.Node, time: number, tx: number, func?: Function) {
        cc.tween(node).to(time, { x: tx })
            .call(() => {
                if (func) {
                    func();
                }
            })
            .start();
    }

    static showChuizi(chuizi: cc.Node, count: number = 1, time: number = 0.1) {
        cc.Tween.stopAllByTarget(chuizi)
        if (count > 0) {
            cc.tween(chuizi).repeat(count,
                cc.tween(chuizi)
                    .call(() => {
                        chuizi.angle = -60
                        chuizi.opacity = 255;
                    })
                    .by(time, { angle: 30 })
                    .call(() => {
                        chuizi.opacity = 0;
                    })
                    .delay(0.1)
            ).start()
        } else {
            cc.tween(chuizi).repeatForever(
                cc.tween(chuizi).repeat(3,
                    cc.tween(chuizi)
                        .call(() => {
                            chuizi.angle = -60
                            chuizi.opacity = 255;
                        })
                        .by(time, { angle: 30 })
                        .call(() => {
                            chuizi.opacity = 0;
                        })
                        .delay(0.1)
                ).delay(3)
            ).start()
        }

    }
    static showRewardItem(node: cc.Node, scale: number = 1, call?: Function) {
        // let scale = this.model.getScale() + 0.5;
        let s2 = scale + 1
        let s3 = s2 + 0.1;
        cc.tween(node).to(0.5, { scale: s2 })
            .delay(0.2)
            .to(0.2, { scale: s3 })
            .to(0.5, { scale: scale })
            .call(() => {
                // this.icon.node.active = false;
                if (call) {
                    call();
                }
            })
            .start();

    }
}