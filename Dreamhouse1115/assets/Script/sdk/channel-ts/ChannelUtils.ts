
export default class ChannelUtils {
    static random(start: number, end?: number): number {
        if (end) {
            return Math.floor(Math.random() * (end - start) + start)
        } else {
            return Math.floor(Math.random() * start);
        }
    }
    static isNull(obj: any): boolean {
        return obj == undefined || obj == null;
    }

    static sendHttpRequest(address: string, data: any, callback: (msg: string, data: any) => void, method: string = "GET") {
        // console.log('sendHttpRequest  address ', address)
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

    static stringToUint8Array(str) {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array
    }

    static compareVersion(v1, v2): number {
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
    static convertToSDKStyle(centerX, centerY, width, height, screenWidth, screenHeight, visibleSize) {
        let scaleValue = visibleSize.height / screenHeight;
        let wxWidth = width / scaleValue;
        let wxHeight = height / scaleValue;
        let left = (centerX / scaleValue) - wxWidth / 2;
        let top = screenHeight - centerY / scaleValue - wxHeight / 2;
        let result = { left: left, top: top, width: wxWidth, height: wxHeight };
        return result;
    }
}