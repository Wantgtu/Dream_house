
enum OrientationType {
    Portrait,
    Landscape,
};

const AdaptTarget = cc.Enum({
    None: 0,
    AdaptPosForTopBang: 1,          //针对顶部刘海，适配元素位置，通过调整Widget属性(竖屏往下移，左横屏往右移)
    AdaptPosForBottomBar: 2,        //针对底部横条，适配元素位置，通过调整Widget属性(竖屏往上移，左横屏往左移)
    AdaptSizeForTopBang: 3,         //针对顶部刘海，适配元素大小，(竖屏往下拉高，左横屏往右拉宽)
    AdaptSizeForBottomBar: 4,       //针对底部横条，适配元素大小，(竖屏往上拉高，左横屏往左拉宽)
});

enum FitType {
    HEIGHT,
    WIDTH,
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdaptUI extends cc.Component {


    @property
    num: number = 100;

    @property({
        type: AdaptTarget
    })
    target = AdaptTarget.AdaptPosForTopBang;

    private widget: cc.Widget;

    start() {
        this.widget = this.node.getComponent(cc.Widget);
        if (!this.widget) {
            this.widget = this.node.addComponent(cc.Widget);
        }
        let frameSize = cc.view.getFrameSize();
        let frameAspectRatio = frameSize.width / frameSize.height;
        let designSize = cc.Canvas.instance.designResolution;
        let designAspectRatio = designSize.width / designSize.height
        let sub = designAspectRatio > frameAspectRatio ? designAspectRatio - frameAspectRatio : frameAspectRatio - designAspectRatio;

        // console.log("sub  ", sub, ' frameAspectRatio ', frameAspectRatio, ' designAspectRatio ', designAspectRatio);

        //顶部偏移
        let topOffset = sub * this.num;//这个值根据自己的设计分辨率调整


        //底部偏移
        let bottomOffset = sub * this.num;

        let orientation = designSize.height > designSize.width ? OrientationType.Portrait : OrientationType.Landscape;

        this.adaptLogic(topOffset, bottomOffset, orientation);
    }

    adaptLogic(topOffset, bottomOffset, orientation) {
        // console.log("adaptLogic", topOffset, bottomOffset, orientation)
        switch (this.target) {
            case AdaptTarget.AdaptPosForTopBang:
                if (topOffset == 0) { return; }
                switch (orientation) {
                    case OrientationType.Portrait:
                        this.widget.top += topOffset;
                        break;
                    case OrientationType.Landscape:
                        this.widget.left += topOffset;
                        break;
                }
                break;
            case AdaptTarget.AdaptPosForBottomBar:
                if (bottomOffset == 0) { return; }
                switch (orientation) {
                    case OrientationType.Portrait:
                        this.widget.bottom += bottomOffset;
                        break;
                    case OrientationType.Landscape:
                        this.widget.right += bottomOffset;
                        break;
                }
                break;
            case AdaptTarget.AdaptSizeForTopBang:
                if (topOffset == 0) { return; }
                switch (orientation) {
                    case OrientationType.Portrait:
                        this.node.anchorY = 1;
                        this.node.height += topOffset;
                        break;
                    case OrientationType.Landscape:
                        this.node.anchorX = 0;
                        this.node.width += topOffset;
                        break;
                }
                break;
            case AdaptTarget.AdaptSizeForBottomBar:
                if (bottomOffset == 0) { return; }
                switch (orientation) {
                    case OrientationType.Portrait:
                        this.node.anchorY = 0;
                        this.node.height += bottomOffset;
                        break;
                    case OrientationType.Landscape:
                        this.node.anchorX = 1;
                        this.node.width += bottomOffset;
                        break;
                }
                break;
        }
    }

}


