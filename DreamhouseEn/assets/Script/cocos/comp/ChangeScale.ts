const { ccclass, property } = cc._decorator;

@ccclass
export default class ChangeScale extends cc.Component {

    @property
    time: number = 0.5;

    @property
    scale: number = 0.4;

    private temp: number = 1;
    start() {
        this.temp = this.node.scale;
        cc.tween(this.node).repeatForever(
            cc.tween(this.node).by(this.time, { scale: this.scale }).by(this.time, { scale: -this.scale })
        ).start();

    }

    stop() {
        this.node.scale = this.temp;
        cc.Tween.stopAllByTarget(this.node)
    }
}