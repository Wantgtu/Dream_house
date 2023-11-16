
import SDKHelper from "../SDKHelper";

let idList: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
]

class BannerSite {
    protected ids: number[] = []
    protected index: number = -1;

    constructor(list: number[]) {
        this.ids = list;
    }
    getIndex() {
        return this.index
    }

    setIndex() {
        let old = this.index
        let idx = this.getRandom();
        this.index = idx;
        if (old >= 0) {
            this.ids.push(old)
        }
    }
    getRandom() {
        let r = SDKHelper.random(0, this.ids.length)
        let index = this.ids[r]
        this.ids.splice(r, 1)
        return index;
    }
}

export default class BannerIDMgr {
    private static ins: BannerIDMgr

    static instance() {
        if (!this.ins) {
            this.ins = new BannerIDMgr()
        }
        return this.ins;
    }
    // protected ids: number[] = []
    protected site: BannerSite[] = []

    constructor() {
        for (let index = 0; index < idList.length; index++) {
            this.site[index] = new BannerSite(idList[index]);
        }
    }


    getIndex(i: number) {
        if (this.site[i]) {
            return this.site[i].getIndex();
        }
        return 0;
    }

    setIndex(i: number) {
        if (this.site[i]) {
            this.site[i].setIndex()
        }

    }
}