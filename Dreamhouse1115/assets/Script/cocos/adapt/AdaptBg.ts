
const { ccclass, property } = cc._decorator;

@ccclass
export default class AdaptBg extends cc.Component {

    start() {
        let designSize = cc.Canvas.instance.designResolution;
        let visibleSize = cc.view.getVisibleSize()
        let rw = visibleSize.width / designSize.width
        let rh = visibleSize.height / designSize.height;
        let bgRatio = 1;
        if (rw > rh) {
            bgRatio = rw;
        } else {
            bgRatio = rh;
        }
        // this.node为背景图片
        this.node.scale = bgRatio
    }

}
