
import Utils from "../../cfw/tools/Utils";
import ScaleForever from "./ScaleForever";


export default class SingleScaleForever {

    static show: ScaleForever = null;

    protected static fingerList: ScaleForever[] = []
    static add(node: ScaleForever) {
        this.fingerList.push(node)
    }

    protected static time: number = 0;

    static clear() {
        this.show = null;
        SingleScaleForever.fingerList.length = 0;
    }

    static stop(c: ScaleForever) {
        this.showFinger()
    }

    static showFinger() {
        if (this.fingerList.length <= 0) {
            return;
        }
        let r = Utils.random(0, this.fingerList.length)
        if (this.show) {
            this.show.node.active = false;
        }
        this.show = this.fingerList[r]
        if (this.show) {
            this.show.node.active = true;
        }
    }



}