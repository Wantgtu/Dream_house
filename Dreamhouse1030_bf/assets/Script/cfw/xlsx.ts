import Base64zh from "./tools/Base64zh";
export enum XlsxType {
    DATA, //单独的数据
    TEMPLATE, //合并到一起的数据
    LANG,// 语言文本。
}
export class XlsxDataManager {

    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }

    private dataMap: { [k: string]: XlsxData } = {};


    addFile(res: any, fileName?: string) {
        if (!res) {
            // console.log(" init file res is null",fileName)
            return;
        }
        // console.log('XlsxDataManager  addFile fileName ', fileName)
        // console.log(" xslx manager add file 11111111111111111111 res ", res)
        let json = res.json ? res.json : res;

        if (json.isEncode) {
            json = this.decode(json.data)
        } else {
            json = json.data
        }
        // console.log(" xslx manager add file 22222222222222222 json ", json.isEncode, json.type)
        if (json.type == XlsxType.TEMPLATE) {
            let room = json.data;
            for (const key in room) {
                this.dataMap[key] = new XlsxData(room[key]);
            }
        } else {
            if (fileName) {
                let key = fileName;
                if (fileName.indexOf('/') >= 0) {
                    let list = fileName.split('/')
                    key = list[list.length - 1]
                }
                // console.log(' add File key is ', key, " fileName ", fileName, json)

                this.dataMap[key] = new XlsxData(json);
            } else {
                console.error('不是合成表，fileName 不能为空 ')
            }

        }

    }

    decode(s: string) {
        // console.log(' s === ', s)
        var ins = Base64zh.decode(s)
        // console.log(' ins =========  ', ins)
        let resObj = JSON.parse(ins)
        return resObj
    }

    get(fileName: string): XlsxData {
        let key = fileName;
        if (fileName.indexOf('/') >= 0) {
            key = fileName.match(/\/(\S*)\./)[1];
        }
        let data = this.dataMap[key];
        if (!data) {
            console.error(' config error get fileName ', fileName, key)
            return null;
        }
        return data;
    }

    getKey(fileName: string) {
        if (fileName.indexOf('/') >= 0) {
            let temp = fileName.split('/')
            if (temp.length == 2) {

            }
        } else {
            return fileName;
        }
    }

    clear() {
        this.dataMap = {};
    }
}


export class XlsxData {

    private data: any[] | any = null;

    private keys: { [k: string]: number } = null;

    //今后要支持多列索引
    private index: { [k: string]: string[][] } = null;

    private type: number = XlsxType.DATA;

    private nameList: string[]
    private typeList: string[]
    private dbList: string[]

    constructor(json: any) {
        if (json) {
            this.initWithJson(json);
        }
    }

    initWithJson(json: any) {
        this.data = json.data
        this.type = json.type;
        this.nameList = json.nameList
        this.typeList = json.typeList
        this.dbList = json.dbList
        if (this.type == XlsxType.DATA) {
            this.keys = json.key;
            this.index = json.index;
        } else {

        }
    }

    getName(index: number) {
        return this.nameList[index]
    }

    getType(index: number) {
        return this.typeList[index]
    }

    getDBName(index: number) {
        return this.dbList[index]
    }

    size(): number {
        return this.data.length;
    }

    getData(): any[] | any {
        return this.data;
    }

    getKeys(): {} {
        return this.keys;
    }

    forEach(func: (key: string | number, value: any[]) => void) {
        for (const key in this.keys) {
            if (this.keys.hasOwnProperty(key)) {
                const element = this.keys[key];
                func(key, this.data[element])
            }
        }
    }
    getRowData(ID: any) {
        ID = "" + ID;
        let data = this.data[this.keys[ID]];
        if (data == undefined) {
            console.warn(' getRowData is null ', ID)
        }
        return data;
    }

    /**
     * 
     * @param ID 行ID
     * @param index 列索引位置
     */
    getValue(ID: any, index?: number) {
        ID = "" + ID;
        if (this.type == XlsxType.DATA && index != undefined) {
            let dIndex = this.keys[ID]
            if (dIndex >= 0) {
                let list = this.data[dIndex]
                if (list && list.length > index) {
                    return list[index];
                } else {
                    // console.warn(' index is out of range ', index, ' id ', ID)
                    return null;
                }
            } else {
                console.warn(' dIndex is wrong ', dIndex, ' id is ', ID, ' index ', index)
                return null;
            }

        } else {
            return this.data[ID];
        }
    }

    /**
     * 拷贝数值 必须是数组类型
     * @param ID 
     * @param index 
     */
    copyValue(ID: any, index?: number) {
        let list = [];
        let value: any[] = this.getValue(ID, index);
        if (value) {
            for (let index = 0; index < value.length; index++) {
                const element = value[index];
                list.push(element)
            }
        }
        return list;
    }

    getIndex(enumValue: number) {
        let key = '' + enumValue
        return this.index[key];
    }

    // getIndexByLineID(lineID: string): any[] {
    //     return this.index[lineID];
    // }
    /**
     * 获取索引列的值对应的id列表
     * @param indexID 索引列的值
     */
    getIndexByID(enumValue: number, value: number): any[] {
        let key = '' + enumValue
        // console.log(' enumValue, value ',key, value)
        // console.log('getIndexByID  this.index  ',this.index)
        if (this.index[key] && this.index[key][value]) {
            return this.index[key][value]
        }
        return []
    }

    /**
     * 返回拷贝的索引id列表
     * @param enmuValue 
     * @param lineID 
     */
    copyIndex(enmuValue: number, lineID: number): any[] {
        let temp: any[] = []
        let list = this.getIndexByID(enmuValue, lineID);
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                temp.push(element)
            }
        }
        return temp;
    }


}
