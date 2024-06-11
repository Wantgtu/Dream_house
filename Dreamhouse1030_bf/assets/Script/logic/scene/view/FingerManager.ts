
import Utils from "../../../cfw/tools/Utils";
import BuildItemView from "./BuildItemView";
import { BaseModel } from "../../../cfw/model";

export default class FingerManager extends BaseModel {

    protected finger: cc.Node = null;

    protected buildTagView: BuildItemView[] = []



    setFinter(f: cc.Node) {
        this.finger = f;
    }

    add(item: BuildItemView) {
        let index = this.buildTagView.indexOf(item)
        if (index < 0) {
            this.buildTagView.push(item)
        }

    }

    clear() {
        this.buildTagView.length = 0;
    }


    showFinger(root: cc.Node) {
        if (this.finger) {
            let count = this.buildTagView.length;
            if (count > 0) {
                let r = Utils.random(0, count)
                let item = this.buildTagView[r]
                if (item) {
                    let pos = item.getWorldPos();
                    pos = root.convertToNodeSpaceAR(pos)
                    this.finger.setPosition(pos)
                }
            }
            cc.tween(this).delay(3)
                .call(() => {
                    this.showFinger(root)
                })
                .start()
        }
    }
}