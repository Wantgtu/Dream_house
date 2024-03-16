import BaseAd from "./BaseAd";
import { SDKState, SDKDir } from "../SDKConfig";


export default abstract class BaseCustomAd extends BaseAd {
    protected customAd: any;
    protected rx: number = 1;
    protected ry: number = 1;
    protected _dir: SDKDir = SDKDir.BOTTOM_MID;
    protected height: number = 525;
    protected width: number = 720;
    protected rIndex: number = 0;

  

    setRIndex(r: number) {
        this.rIndex = r;
    }

    setSize(w: number, h: number) {
        this.width = w;
        this.height = h;
    }
    setDir(dir: SDKDir) {
        this._dir = dir;
    }
    setRx(x: number) {
        this.rx = x;
    }

    setRy(y: number) {
        this.ry = y;
    }
    updateSize() {

    }
    preload(s: SDKState) {
        this.logicState = s;
        this.load()
    }
}