import { BaseItemModel } from "../../cfw/model";
import Utils from "../../cfw/tools/Utils";
import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { UIIndex } from "../../config/UIConfig";
import { ModuleID } from "../../config/ModuleConfig";
import RecorderView from "./RecorderView";
import { BaseView } from "../../cfw/view";
import FoodMgr from "../../logic/game/model/FoodMgr";
import UIManager from "../../cfw/ui";

export default class ShareController extends BaseController {
    protected item: BaseItemModel;
    protected count: number = 0;
    private setItem() {
        this.count++;
        // console.warn('ShareController setItem 1111 ')
        let random = Utils.random(0, 100)
        if (random >= 70 || this.count % 10 == 0) {
            this.item = FoodMgr.instance().getItemByRare(3)
        } else {
            this.item = FoodMgr.instance().getItemByRareList([1, 2])
        }
        // console.warn('ShareController setItem 2222')

    }

    getItem() {
        return this.item;
    }

    intoLayer() {
        // let m = SDKManager.getChannel().getRecorder()
        let path = 'prefabs/RecorderView'
        let flag = UIManager.instance().hasViewByPath(path, UIIndex.STACK)
        console.log('RecorderC  flag', flag)
        if (flag) {
            return;
        }
        this.setItem()

        ViewManager.pushUIView({
            path: path,
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            className: RecorderView,
            model: null,
            controller: this
        })
    }

    getReward(view: BaseView) {

    }

    startRecorder() {

    }


    stopRecorder(view: BaseView) {

    }
}