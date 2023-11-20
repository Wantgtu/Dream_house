import RedTipPoint from "./RedTipPoint";
import RedTipMgr from "./RedTipMgr";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
export default class RedTipView extends cc.Component {

    protected icon: cc.Sprite = null;
    protected points: RedTipPoint[] = []
    onLoad() {
        this.icon = this.node.getComponent(cc.Sprite)
        this.points = this.node.getComponents(RedTipPoint)
        for (let index = 0; index < this.points.length; index++) {
            const element = this.points[index];
            RedTipMgr.instance().on(RedTipMgr.ADD_TIP + element.type, this.addRedTip, this)
            RedTipMgr.instance().on(RedTipMgr.REMOVE_TIP + element.type, this.removeRedTip, this)
        }
        this.updateState();
    }

    onDestroy() {
        for (let index = 0; index < this.points.length; index++) {
            const element = this.points[index];
            RedTipMgr.instance().off(RedTipMgr.ADD_TIP + element.type, this.addRedTip, this)
            RedTipMgr.instance().off(RedTipMgr.REMOVE_TIP + element.type, this.removeRedTip, this)
        }
    }

    addRedTip(type: number, id: number) {
        for (let index = 0; index < this.points.length; index++) {
            const element = this.points[index];
            if (type == element.type) {
                if (element.id > 0) {
                    if (id == element.id) {
                        if (!this.icon.node.opacity) {
                            this.icon.node.opacity = 255;
                        }
                    }
                } else {
                    if (!this.icon.node.opacity) {
                        this.icon.node.opacity = 255;
                    }
                }

                break;
            }
        }
    }

    updateState() {
        if (!this.icon) {
            this.icon = this.node.getComponent(cc.Sprite)
            this.points = this.node.getComponents(RedTipPoint)
        }
        for (let index = 0; index < this.points.length; index++) {
            const element = this.points[index];
            if (RedTipMgr.instance().hasRedTip(element.type, element.id)) {
                if (!this.icon.node.opacity) {
                    this.icon.node.opacity = 255;
                }
                return;
            }

        }
        if (this.icon.node.opacity == 255) {
            this.icon.node.opacity = 0;
        }
    }

    removeRedTip(type: number, id: number) {
        this.updateState();
    }


}