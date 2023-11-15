
import G4399RewardAd from "./G4399RewardAd";
import BaseChannel from "../../sdk/base/BaseChannel";
import G4399Share from "./G4399Share";
import { ADName } from "../SDKConfig";
/**
 * 将script标签放入index文件中。
 * <script src="https://h.api.4399.com/h5mini-2.0/h5api-interface.php"></script>
 * https://www.4399api.com/doc/#/h5mini/base
 */
export class G4399Channel extends BaseChannel {

    init() {
        let cfg = this.cfg;
        let list = cfg[ADName.reward]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.rewardAd.push(new G4399RewardAd(this, adId))
            }
        }
        this.share = new G4399Share(this, cfg[ADName.share])
    }

    onHide() {

    }

    onShow() {

    }

}