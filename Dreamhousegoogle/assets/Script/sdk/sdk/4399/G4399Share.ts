import { BaseShare } from "../../sdk/base/BaseShare";
import { ResultCallback, ResultState } from "../SDKConfig";


export default class G4399Share extends BaseShare {




    share(site: number, func?: ResultCallback) {
        this.callback = func;
        if (this.sdk) {
            this.sdk.share();
        }

        this.callback(ResultState.YES)
    }
}