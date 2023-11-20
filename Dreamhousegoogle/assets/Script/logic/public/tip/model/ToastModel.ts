import { BaseItemModel } from "../../../../cfw/model";

export default class ToastModel extends BaseItemModel {


    text: string = 'hello';


    constructor(t: string) {
        super()
        this.text = t;
    }

}
