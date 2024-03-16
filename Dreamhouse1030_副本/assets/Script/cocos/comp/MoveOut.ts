
import TweenMgr from "../TweenMgr";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MoveOut extends cc.Component {

    // @property(EngineView)
    // view: EngineView = null;

    @property(cc.Component.EventHandler)
    handler: cc.Component.EventHandler = new cc.Component.EventHandler();

    onBackClick() {
        let size = cc.view.getVisibleSize()
        TweenMgr.moveRight(this.node, 0.2, size.width, () => {
            // UIManager.instance().popView(this.view)
            if (this.handler) {
                this.handler.emit([this.handler.customEventData])
            }
        })
    }
}