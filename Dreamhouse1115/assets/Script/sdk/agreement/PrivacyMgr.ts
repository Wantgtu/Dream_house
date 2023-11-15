import { BaseModel } from "../../cfw/model";
import { Agreement } from "./data/Agreement";
import { TestEmail } from "./data/TestEmail";
import CMgr from "../channel-ts/CMgr";


export default class PrivacyMgr extends BaseModel {
    protected text: string[] = []
    protected index: number = 0;
    protected textList: string[][] = []
    constructor() {
        super();
    }

    setIndex(i: number) {
        this.index = i;
    }

    getText() {
        return this.text[this.index]
    }

    getTextList() {
        return this.textList[this.index]
    }


    init(app_name: string, company: string, email: string, address: string) {
        if (this.text.length == 0) {
            this.text[0] = this.setText(Agreement, app_name, company, email, address, 0)
            this.text[1] = this.setText(TestEmail, app_name, company, email, address, 1)
        }

    }


    setText(data: Object, app_name: string, company: string, email: string, address: string, index: number = 0) {
        let text = ''
        this.textList[index] = []
        let list: string[] = this.textList[index];
        // let json = JSON.stringify(data)
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                // console.log(' element ', element)
                let t: string = element.text;

                // console.log(' element t ', t)
                let type = typeof (t)
                if (t) {
                    if (type == 'string') {
                        if ((key == '21' || key == '20') && !CMgr.helper.hasEmail()) {

                        } else {
                            t = t.replace(/app_name/g, app_name)
                            t = t.replace(/company/g, company)
                            t = t.replace(/email/g, email)
                            t = t.replace(/address/g, address)
                            text += t;
                            list.push(t)
                        }

                    } else {
                        let tt = ''
                        for (let index = 0; index < t.length; index++) {
                            let txt = t[index];
                            txt = txt.replace(/app_name/g, app_name)
                            txt = txt.replace(/company/g, company)
                            txt = txt.replace(/email/g, email)
                            txt = txt.replace(/address/g, address)
                            text += txt;
                            tt += txt;
                        }
                        list.push(tt)
                    }

                }

            }
        }
        return text;
    }

}