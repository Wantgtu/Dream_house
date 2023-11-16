import { BaseModel } from "../../../cfw/model";
import { BUY_TOKEN } from "../../../config/Config";

export default class BuyTokenModel extends BaseModel {

    protected num: number = 0;

    constructor(n: number) {
        super();
        this.num = n;
    }

    getNum() {
        return BUY_TOKEN;
    }
}