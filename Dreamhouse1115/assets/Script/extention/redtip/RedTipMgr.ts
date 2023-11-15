

import { EventDispatcher } from "../../cfw/event";
import Debug from "../../cfw/tools/Debug";
export default class RedTipMgr extends EventDispatcher {

    static ADD_TIP: string = 'add_tip'
    static REMOVE_TIP: string = 'remove_tip'
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }

    protected tipList: number[][] = []


    addRedTip(type: number, id: number = -1) {
        if (!this.tipList[type]) {
            this.tipList[type] = []
        }
        if (id == -1) {
            if (this.tipList[type].length > 0) {
                return;
            }
        } else {
            // id = parseInt(id)//不可以这样
            let index = this.getIndex(this.tipList[type], id)
            if (index >= 0) {
                return;
            }
        }

        // Debug.warn('addRedTip type ', type, id)
        this.tipList[type].push(id)

        this.emit(RedTipMgr.ADD_TIP + type, type, id)

    }

    removeRedTip(type: number, id: number = -1) {
        if (!this.tipList[type]) {
            return;
        }
        // Debug.warn('removeRedTip type ', type, id, this.tipList[type])
        let flag = false;
        if (id == -1) {
            if (this.tipList[type].length > 0) {
                this.tipList[type].pop()
                flag = true;

            }
        } else {
            // id = parseInt(id)
            let index = this.getIndex(this.tipList[type], id)
            // Debug.warn('removeRedTip type ', type, id, typeof (id), this.tipList[type], index)
            if (index >= 0) {
                this.tipList[type].splice(index, 1)
                flag = true;
            }
        }
        if (flag) {
            this.emit(RedTipMgr.REMOVE_TIP + type, type, id)
        }
    }

    hasRedTip(type: number, id: number = -1) {
        if (!this.tipList[type]) {
            return false;
        }

        if (id == -1) {
            // Debug.log('this.tipList[type] ', this.tipList[type])
            // Debug.warn('hasRedTip this.tipList[type].length ', type, id, typeof (id), this.tipList[type].length)
            return this.tipList[type].length > 0
        } else {
            // id = parseInt(id)
            let index = this.getIndex(this.tipList[type], id)
            // Debug.warn('hasRedTip type ', type, id, typeof (id), index, index >= 0)
            // Debug.log('this.tipList[type] ', this.tipList[type])
            return index >= 0
        }
    }

    private getIndex(list: number[], id: number = - 1) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element == id) {
                return index;
            }

        }
        return -1
    }
}