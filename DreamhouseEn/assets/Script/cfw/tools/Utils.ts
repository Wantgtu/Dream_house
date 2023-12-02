

import { HttpResultCallback } from "./Define";
/**
 * 我们目前所用的K、M、G、T等都是英文表示方法，分别是Kilo（103）、Mega（106）、Giga（109）、Tera（1012）的简写，
 * 更大的还有Peta（1015）、Exa（1018）、Bronto（1021）等。
 */
let moneyNum: number[] = [1000000000000000000000, 1000000000000000000, 1000000000000000, 1000000000000, 1000000000, 1000000, 1000, 1]
let moneyText: string[] = ['b', 'e', 'p', 't', 'g', 'm', 'k', '']
export default class Utils {

    /**
     * s = at*at/2
     * @param a 
     * @param s 
     */
    static getVy(a: number, s: number): number {
        let h = 0;
        let v0 = 0;
        let t = 0;
        if (a > 0) {
            while (h < s) {
                v0 += a;
                h += v0;
                t++;
            }
        }
        return v0
    }




    static replace(str: string, key: number | string, value: any): string {
        str = str.replace("%{" + key + "}", value);
        return str;
    }

    static replaceOpt(str: string, opt?: any) {
        if (str) {
            if (str.indexOf('\\') >= 0) {
                str = str.replace(/\\n/g, '\n');
            }
            if (opt) {
                for (const key in opt) {
                    // let option:LangOption = opt[key];
                    let value = opt[key];
                    // if(option.getType() == LangOptionType.LANG_ID){
                    //     value = this.data.getValue(value);
                    // }
                    // console.log(' key ',key,' value ',value)
                    str = str.replace("%{" + key + "}", value);
                    // console.log(' str ',str)
                }
            }
        }
        return str;
    }

    /**
     * 获取最后一个字符串
     * @param str 
     * @param tag 
     */
    static laststring(str: string, tag: string) {
        let index: number = str.indexOf(tag);
        if (index >= 0) {
            let list = str.split(tag);
            return list[list.length - 1]
        }
        return str;
    }

    /**
     * 
     * @param num 
     */
    static getShortStr(num: number, len: number = 100): string {
        let i = moneyNum.length - 1;
        let money = 0;
        for (let index = 0; index < moneyNum.length; index++) {
            const element = moneyNum[index];
            if (num >= element) {
                i = index
                money = Math.floor(num * len / element);
                break;
            }

        }
        let tail = moneyText[i];
        return (money / len) + tail;
    }

    static getRandomValueByList(randomList: number[]) {
        let r = 0;
        let step: number = 2
        let count = randomList.length / step;
        for (let index = 0; index < count; index++) {
            const num = randomList[index * step];
            let random = randomList[index * step + 1]
            r += random;
            let ran = this.random(0, 100)
            if (ran <= r) {
                return num;
            }
        }
        return 0;
    }


    static random(start: number, end?: number): number {
        if (end) {
            return Math.floor(Math.random() * (end - start) + start)
        } else {
            return Math.floor(Math.random() * start);
        }
    }

    static randomFloat(min: number, max: number) {
        return Math.random() * (max - min) + min
    }

    /**
  * 
  * @param x1 
  * @param y1 
  * @param x2 
  * @param y2 
  */
    static distance(x1: number, y1: number, x2: number, y2: number) {
        let dx: number = x1 - x2;
        let dy: number = y1 - y2;
        let distance: number = Math.sqrt(dx * dx + dy * dy);
        return distance;
    }




    /**
     * 根据角度获得弧度
     * @param radian 
     */
    static getAngleByRadian(radian: number) {
        return radian * 57.3
    }

    static getRadinByAngle(angle: number) {
        return angle / 57.3;
    }

    /**
     * 获得弧度
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     */
    static getRadianByXY(x1: number, y1: number, x2: number, y2: number) {
        let disx = Math.abs(x2 - x1);
        let disy = Math.abs(y2 - y1);
        let dis = Math.sqrt(disx * disx + disy * disy)
        let radian: number = Math.asin(disx / dis)
        return radian;
    }
    static getRadianByXY2(x1: number, y1: number, x2: number, y2: number) {
        let disx = Math.abs(x2 - x1);
        let disy = Math.abs(y2 - y1);
        let dis = Math.sqrt(disx * disx + disy * disy)
        let radian: number = Math.acos(disx / dis)
        return radian;
    }
    /**
     * 获得角度
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     */
    static getAngleByXY(x1: number, y1: number, x2: number, y2: number) {
        return this.getRadianByXY(x1, y1, x2, y2) * Math.PI;
    }



    static isRectCollideRect2(x1: number, width1: number, x2: number, width2: number) {
        let flag = !(x2 + width2 < x1 || x2 > x1 + width1);
        return flag;
    }
    static isRecctCollideRect3(left1: number, right1: number, top1: number, bottom1: number,
        left2: number, right2: number, top2: number, bottom2: number) {
        let flag = !(right2 < left1 || bottom2 < top1 || left2 > right1 || top2 > bottom1);
        return flag;
    }
    static isRecctCollideRect(left1: number, right1: number, top1: number, bottom1: number,
        left2: number, right2: number, top2: number, bottom2: number) {
        let flag = !(right2 < left1 || bottom2 > top1 || left2 > right1 || top2 < bottom1);
        return flag;
    }

    static isRectCollideAnchor(x1: number, y1: number, w1: number, h1: number, a1x: number, a1y: number,
        x2: number, y2: number, w2: number, h2: number, a2x: any, a2y: any) {

        let left1 = x1 - (w1 * a1x)
        let right1 = left1 + w1;
        let bottom1 = y1 - (h1 * a1y)
        let top1 = bottom1 + h1;
        let left2 = x2 - (w2 * a2x)
        let right2 = left2 + w2;
        let bottom2 = y2 - (h2 * a2y)
        let top2 = bottom2 + h2;
        return this.isRecctCollideRect(left1, right1, top1, bottom1, left2, right2, top2, bottom2)
    }
    static isRectCollideAnchorScale(x1: number, y1: number, w1: number, h1: number, a1x: number, a1y: number, s1: number,
        x2: number, y2: number, w2: number, h2: number, a2x: any, a2y: any, s2: number) {

        let left1 = x1 - (w1 * s1 * a1x)
        let right1 = left1 + w1 * s1;
        let bottom1 = y1 - (h1 * s1 * a1y)
        let top1 = bottom1 + h1 * s1;
        let left2 = x2 - (w2 * s2 * a2x)
        let right2 = left2 + w2 * s2;
        let bottom2 = y2 - (h2 * s2 * a2y)
        let top2 = bottom2 + h2 * s2;
        return this.isRecctCollideRect(left1, right1, top1, bottom1, left2, right2, top2, bottom2)
    }
    static isRectCollide(r1: any, r2: any) {

        let flag = !(r2.right < r1.left || r2.bottom > r1.top || r2.left > r1.right || r2.top < r1.bottom);

        return flag;
    }


    static isXYInRect(x: number, y: number, rect: any) {
        return x <= rect.right && x >= rect.left && y <= rect.top && y >= rect.bottom;
    }

    /**
     * 
     * @param x 
     * @param y 
     * @param x2 
     * @param y2 
     * @param width 
     * @param height 
     * @param an 
     * @param des 
     */
    static isPosInRect(x: number, y: number, x2: number, y2: number, width: number, height: number, anx: number, any: number) {

        let left = x2 - width * anx
        let buttom = y2 - height * any;
        let flag1 = x <= left + width
        let flag2 = x >= left;
        let flag3 = y <= buttom + height;
        let flag4 = y >= buttom;
        return flag1 && flag2 && flag3 && flag4;
    }
    /**
     * 物体是否已经出屏
     * @param x 
     * @param y 
     * @param size 
     */
    static isOutScreen(x: number, y: number, w: number, h: number, dw: number, dh: number): boolean {
        // let screen = cc.view.getFrameSize();
        let hw = w / 2;
        let hh = h / 2;

        let flag = x < -hw || x > dw + hw || y > dh + hh || y < - hh;
        if (flag) {
            // cc.log('isOutScreen width ',dw,' height ',dh,' x ',x,' y ',y,' flag ',flag)
        }
        return flag
    }


    /**
     * 物体是否已经出屏
     * @param x 
     * @param y 
     * @param size 
     */
    static isOutScreenExceptTop(x: number, y: number, w: number, h: number, dw: number, dh: number): boolean {
        // let screen = cc.view.getFrameSize();
        let hw = w / 2;
        let hh = h / 2;

        let flag = x < - hw || x > dw + hw || y < - hh;
        if (flag) {
            // cc.log('isEnemyOutScreen width ',dw,' height ',dh,' x ',x,' y ',y,' flag ',flag)
        }
        //
        return flag
    }



    static isNull(obj: any): boolean {
        return obj == undefined || obj == null;
    }

    static sendHttpRequest(address: string, data: any, callback: HttpResultCallback, method: string = "GET") {
        console.log('sendHttpRequest  address ', address)
        let xhr = new XMLHttpRequest();
        xhr.timeout = 15000;
        xhr.ontimeout = function () {
            callback('ontimeout ', null)
        }
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
                var data = xhr.responseText;
                callback(null, data)
            } else {
                callback('onload error ', null)
            }
        };
        if (method == 'GET') {
            address = address + "?" + data;
            xhr.open(method, address);
            try {
                xhr.send();
            } catch (error) {
                callback('get error ' + error, null)
            }

        } else {
            // post请求
            xhr.open(method, address);
            try {
                xhr.send(data);
            } catch (error) {
                callback('POST error ' + error, null);
            }

        }
    }
    static uint8ArrayToString(fileData: Uint8Array) {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
        return dataString
    }

    static stringToUint8Array(str: string) {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array
    }

    static compareVersion(v1: any, v2: any): number {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 2
            } else if (num1 < num2) {
                return 0
            }
        }

        return 1
    }

    //x,y,width,height是cocos坐标的节点的中心点位置和长高
    static convertToSDKStyle(
        centerX: number, centerY: number,
        width: number, height: number,
        screenWidth: number, screenHeight: number, visibleSize: any) {
        let scaleValue = visibleSize.height / screenHeight;
        let wxWidth = width / scaleValue;
        let wxHeight = height / scaleValue;
        let left = (centerX / scaleValue) - wxWidth / 2;
        let top = screenHeight - centerY / scaleValue - wxHeight / 2;
        let result = { left: left, top: top, width: wxWidth, height: wxHeight };
        return result;
    }

}
