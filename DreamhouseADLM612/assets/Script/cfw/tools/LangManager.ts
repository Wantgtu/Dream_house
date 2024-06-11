
import { GEvent, EventDispatcher } from "../event";
export class LANG_NAME {
    static ZH: string = 'zh'
    static EN: string = 'en'
}
export default class LangManager extends EventDispatcher {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }
    private langName: string = LANG_NAME.ZH;
    private data: { [k: string]: string }[] = [];

    getLang() {
        return this.langName;
    }

    clear(): void {
        this.data.length = 0;
    }

    addData(data: { [k: string]: string }) {
        this.data.push(data);
    }


    setLang(langName: string) {
        if (this.langName == langName) {
            return;
        }
        // cc.log(' langName ',langName)
        this.langName = langName;
        this.emit(GEvent.CHANGE_LANG)
    }

    getLocalString(langID: string, opt?: any): any {
        if (this.data.length <= 0) {
            console.warn("LangManager is not init localString langID  ", langID, this.data);
            return '';
        }
        for (let index = 0; index < this.data.length; index++) {
            let str = this.getLocalStringByIndex(index, langID, opt)
            if (str) {
                return str;
            }

        }
        return ''
    }

    getData(index: number) {
        return this.data[index]
    }

    private getLocalStringByIndex(index: number, langID: string, opt?: any): any {
        let data = this.data[index]
        if (!data) {
            console.warn("LangManager is not init localString langID  ", langID, this.data);
            return '';
        }
        let str: string = data[langID];
        if (str) {
            if (str.indexOf('\\') >= 0) {
                str = str.replace(/\\n/g, '\n');
            }
            if (opt) {
                for (const key in opt) {
                    let value = opt[key];
                    str = str.replace("%{" + key + "}", value);

                }
            }
        }
        return str;
    }

}
