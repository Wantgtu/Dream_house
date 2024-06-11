import { BaseView } from "../../../cfw/view";
import BagManager from "../../public/bag/BagManager";
import { ItemID, ENRGY_NUM2, EventName } from "../../../config/Config";
import { GEvent } from "../../../cfw/event";

const { ccclass, property } = cc._decorator;

@ccclass
export class rewardLayer extends BaseView {
    @property(cc.Label)
    lb_btnText: cc.Label | null = null;

    reward: number = 100;
    launchData = null;
    start() {
      
    }

    OnClickGet() {
        if (this.launchData && this.launchData.launch_from == "homepage" && this.launchData.location == "sidebar_card" ) {
            this.onbackBtnButtonClick();
            let size = cc.view.getVisibleSize();
            let pos = cc.v2(size.width / 2, size.height / 2)
            BagManager.instance().updateItemNum(ItemID.ENERGY, this.reward, pos);
            GEvent.instance().emit(EventName.CHECK_REWARD);
        } else {
            this.onbackBtnButtonClick();
            tt.navigateToScene({
                scene: "sidebar",
                success: (res) => {
                    console.log("navigate to scene success");
                    // 跳转成功回调逻辑
                    GEvent.instance().emit(EventName.CHECK_REWARD);
                },
                fail: (res) => {
                    console.log("navigate to scene fail: ", res);
                    // 跳转失败回调逻辑
                },
            });
        }
    }

    onbackBtnButtonClick() {
        this.node.active = false;
    }
    
    setLaunchFrom (data) {
        this.launchData = data;
        if (this.launchData && this.launchData.launch_from == "homepage" && this.launchData.location == "sidebar_card" ) {
            this.lb_btnText.string = "领取奖励";
        } else {
            this.lb_btnText.string = "前往侧边栏 ";
        }
    }
}