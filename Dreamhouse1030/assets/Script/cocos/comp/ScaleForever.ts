import Utils from "../../cfw/tools/Utils";
import SingleScaleForever from "./SingleScaleForever";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScaleForever extends cc.Component {


    @property
    time: number = 0.3;

    @property
    scale: number = 0.1;

    @property
    delay: number = 0.2;

    @property
    duration: number = 3;

    @property
    preDelay: number = 0;

    @property
    isSingle: boolean = false;

    start() {
        this.show();
        if (this.isSingle) {
            this.node.active = false
            SingleScaleForever.add(this)
        }

    }

    getTime() {
        let temp = (this.time * 2 + this.duration + this.delay) * 3
        return temp;
    }

    show() {
        // let time = 0.3;
        if (this.duration < 0) {
            this.duration = Utils.random(1, 6)
        }
        if (this.preDelay < 0) {
            this.preDelay = Utils.random(1, 6)
        }
        this.node.opacity = 0;

        cc.tween(this.node).repeatForever(
            cc.tween(this.node)
                .delay(this.preDelay)
                .call(() => {
                    this.node.opacity = 255;
                }).repeat(3, cc.tween(this.node).by(this.time, { scale: this.scale })
                    .delay(this.delay)
                    .by(this.time, { scale: -this.scale }))

                .call(() => {
                    this.node.opacity = 0;

                })
                .delay(this.duration)
                .call(() => {
                    if (this.isSingle) {
                        SingleScaleForever.stop(this)
                    }
                })
        ).start();
    }

    stop() {

    }
}