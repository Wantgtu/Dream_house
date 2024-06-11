import { DataCallback, ResultState, ResultCallback } from "./SDKConfig";

export default class SDKHelper {

    static random(start: number, end?: number): number {
        if (end) {
            return Math.floor(Math.random() * (end - start) + start)
        } else {
            return Math.floor(Math.random() * start);
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

    static isNull(obj: any): boolean {
        return obj == undefined || obj == null;
    }


    static compareVersion(v1: any, v2: any) {
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
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }

        return 0
    }
    static addScript(url: string, id: string = "", callback: (msg: string, data) => void): void {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = id;
        script.onload = function (data) {
            callback(null, data)
        };

        script.onerror = function () {
            // script.src = url;
            callback('error ', '')
        }
        script.src = url;
        console.log("addSprite url ", url)
        head.appendChild(script);
    }

    static sendHttpRequest(address: string, data: any, callback: (msg: string, data: any) => void, method: string = "GET") {
        console.log('sendHttpRequest  address ', address)
        let xhr = new XMLHttpRequest();
        xhr.timeout = 15000;
        xhr.ontimeout = function () {
            callback('ontimeout ', null)
        }
        xhr.onload = function () {
            console.log('onload xhr.status', xhr.status, 'xhr.readyState ', xhr.readyState)
            if (xhr.status >= 200 && xhr.status < 400) {
                var data = xhr.responseText;
                callback(null, data)
            } else {
                callback('onload error ', null)
            }
        };
        // xhr.onreadystatechange = function () {
        //     // console.log('onreadystatechange xhr.status', xhr.status, 'xhr.readyState ', xhr.readyState)
        //     if (xhr.readyState == 4) {
        //         if (xhr.status == 200) {
        //             var data = xhr.responseText;
        //             callback(null, data)
        //         } else {
        //             // console.log('error', xhr.responseText)
        //         }
        //     }
        // }
        console.log(' 222')
        if (method == 'GET') {
            if (data) {
                address = address + "?" + data;
            }
            xhr.open(method, address, true);

            // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            // xhr.responseType = "blob";

            // xhr.responseType = "json";

            var innerHeaer = {
                'content-type': 'application/json', // 默认值
                'If-Modified-Since': '0'
                // 'X-Requested-With': 'XMLHttpRequest',
                // 'Accept': 'audio/mp3',
                // 'share-secret': '',
                // 'Authorization': 'Bearer ' + ''
            };
            for (var key in innerHeaer) {
                if (innerHeaer[key]) {
                    xhr.setRequestHeader(key, innerHeaer[key]);
                }
                console.log(' 333')
            }
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
}
