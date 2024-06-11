let URL = ''//"https://wechat.xxddjj.top:8090";
export default class HTTP {

    sessionId: number = 0
    userId: number = 0;
    master_url: string = URL
    url: string = URL
    sendRequest(path, data, handler: Function, extraUrl: string = null) {
        // var xhr = cc.loader.getXMLHttpRequest();
        let xhr: any = this.createXHR();
        xhr.timeout = 5000;
        var str = "?";
        for (var k in data) {
            if (str != "?") {
                str += "&";
            }
            str += k + "=" + data[k];
        }
        if (extraUrl == null) {
            extraUrl = this.url;
        }
        var requestURL = extraUrl + path + encodeURI(str);
        console.log("RequestURL:" + requestURL);
        xhr.open("GET", requestURL, true);
        // if (cc.sys.isNative) {
        //     xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        // }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                console.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
                try {
                    var ret = JSON.parse(xhr.responseText);
                    if (handler !== null) {
                        handler(ret);
                    }                        /* code */
                } catch (e) {
                    console.log("err:" + e);
                    //handler(null);
                }
                finally {
                    // if (cc.vv && cc.vv.wc) {
                    //     //       cc.vv.wc.hide();    
                    // }
                }
            }
        };
        // if (cc.vv && cc.vv.wc) {
        //     //cc.vv.wc.show();
        // }
        xhr.send();
        return xhr;
    }

    createXHR() {
        // IE7+,Firefox, Opera, Chrome ,Safari
        return new XMLHttpRequest();
    }
}