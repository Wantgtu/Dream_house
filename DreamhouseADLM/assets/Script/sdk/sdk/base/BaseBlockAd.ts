import BaseAd from "./BaseAd";
import { ADDir, SDKState } from "../SDKConfig";

export default abstract class BaseBlockAd extends BaseAd {
    protected _x: number = 0;
    protected _y: number = 0;
    protected _dir: ADDir = ADDir.vertical;

    protected count: number = 1;
    protected blackAd: any;

    setDir(dir: ADDir) {
        this._dir = dir;
    }

    setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
    }
    setCount(c: number) {
        if (this.count != c) {
            this.setState(SDKState.close)
            this.count = c;
        }
    }
}