window.zs=window.zs||{},function(){"use strict";class t{constructor(){}static initSdkByConf(e={}){t.conf.channel=e.channel?e.channel:t.conf.channel,t.conf.appId=e.appId?e.appId:t.conf.appId,t.conf.secret=e.secret?e.secret:t.conf.secret,this.Instance=this.getInstance(t.conf.channel)}static init(t){this.Instance?this.Instance.init?(t||console.error("SDK\u521d\u59cb\u5316\u672a\u4f20\u5165\u7528\u6237\u552f\u4e00\u6807\u8bc6"),this.Instance.init(t)):console.error("\u8be5\u5e73\u53f0\u4e0d\u652f\u6301\u8be5\u63a5\u53e3"):console.error("SDK\u672a\u521d\u59cb\u5316")}static login(t,e){this.Instance&&this.Instance.login&&this.Instance.login(t,e)}static loadAd(t){this.Instance&&this.Instance.loadAd&&this.Instance.loadAd(t)}static loadCfg(t,e){this.Instance&&this.Instance.loadCfg&&this.Instance.loadCfg(t,e)}static navigate2Mini(t,e,n,o,i){this.Instance&&this.Instance.navigate2Mini&&this.Instance.navigate2Mini(t,e,n,o,i)}static uploadNavigateEvent(t,e){this.Instance&&this.Instance.uploadNavigateEvent&&this.Instance.uploadNavigateEvent(data,openid)}static showMoreGamesModal(t,e){this.Instance&&this.Instance.showMoreGamesModal&&this.Instance.showMoreGamesModal(t,e)}static isFromLink(){return this.Instance&&this.Instance.isFromLink&&this.Instance.isFromLink()}static getInstance(t){switch(t){case"wx":return new e;case"oppo":return new a;case"vivo":return new o;case"tt":return new i;case"qq":return new n;case"baidu":return new s;default:console.error("\u6682\u4e0d\u652f\u6301"+t+"\u5e73\u53f0")}}}(window.zs=window.zs||{}).sdk=t,t.Instance=null,t.conf={appId:"wxb224f74530ba6665",secret:"7CaD3L23LlGnENd1",uploadLog:"true",channel:"wx"},t.adDomain="https://zsad.zxmn2018.com",t.adDomainList=["https://zsad.zxmn2018.com","https://ad.ali-yun.wang","https://zsad.zaml2018.com"];class e{constructor(){this.tjconf={app_key:t.conf.appId,getLocation:!1},this.loginUrl="https://cpcf.wqop2018.com/api/app_login/index",this.cfgUrl="https://cpcf.wqop2018.com/api/list_config/index",this.userId=null,this.srcAppId="",this.launchScene="",this.linkSceneList=[1011,1012,1013,1025,1031,1032,1047,1048,1049,1124,1125,1126],this.adCbList=[],this.inAdRequest=!1}get adUrl(){return t.adDomain+"/api/"}postExportAppLog(e,n){var o=this.adUrl+"appad_new/collect",i=Math.round((new Date).getTime()/1e3).toString(),a={user_id:n,from_id:t.conf.appId,to_id:e,timestamp:i},s=buildSign(a),r=Object.assign({},a,{sign:s});request(o,r,"POST",function(){},function(){console.log("appad_new/collect fail")},function(){console.log("appad_new/collect complete")})}collect(t,e){if("3"==t.app_type){var n=getStorageSync(t.appid);setStorageSync(t.appid,null==n?1:Number(n)+1)}"undefined"!=typeof wx&&this.postExportAppLog(t.app_id,e)}zsLogin(t,e,n){request(this.loginUrl,n,"POST",function(n){if(200!=n.code)console.log("\u6307\u8272sdk\u767b\u5f55\u8fd4\u56de\u5931\u8d25"+JSON.stringify(n.msg)),e&&e(n.msg);else{if(!n||!n.data)return e&&e("\u8fd4\u56de\u6570\u636e\u5f02\u5e38"+JSON.stringify(n)),void console.log("\u767b\u5f55\u8fd4\u56de\u6570\u636e\u5f02\u5e38"+JSON.stringify(n));console.log("\u6307\u8272sdk\u767b\u5f55\u6210\u529f,\u8fd4\u56de\u7528\u6237id\uff0c"+n.data.openid+"  \u8bf7\u4f7f\u7528\u8be5id\u521d\u59cb\u5316sdk"),t&&t(n.data.openid)}},function(t){console.log("\u6307\u8272sdk\u767b\u5f55\u8bf7\u6c42\u5931\u8d25"+JSON.stringify(t)),e&&e(t)},function(){console.log("requestAdData complete")})}init(e){if(console.log("zsAdSdk.init"),this.userId=e,"undefined"!=typeof wx){var n=this;!function(){function e(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return t()+t()+t()+t()+t()+t()+t()+t()}function o(e,n,a){function s(){return new Promise(function(n){let i=wx.getStorageSync("tjxx");if(i&&void 0!==i.openid)for(a in i)e[a]=i[a];""==e.cd?n(""):(m++,wx.request({url:t.adDomain+"/api/app_jump/in",data:e,header:{se:f||"",op:g||"",img:q||""},method:"POST",success:function(t){wx.setStorageSync("tjxx",t.data),clearTimeout(d),void 0!==t.data.rtime&&parseInt(t.data.rtime)>0?d=setTimeout(function(){o(e,n,2)},1e3*parseInt(t.data.rtime)):void 0!==i.rtime&&parseInt(i.rtime)>0&&(d=setTimeout(function(){o(e,n,2)},1e3*parseInt(i.rtime)))},fail:function(){void 0!==i.rtime&&parseInt(i.rtime)>0&&(clearTimeout(d),d=setTimeout(function(){o(e,n,2)},1e3*parseInt(i.rtime)))}}))})}e.rq_c=m,e.cd=w,e.ifo=l,e.ak=c.app_key,e.uu=u,e.v=r,e.st=Date.now(),e.ev=n,e.wsr=_,e.ufo=i(e.ufo),e.ec=h,void 0===a?wx.Queue.push(s):s()}function i(t){if(void 0===t||""===t)return"";var e={};for(var n in t)"rawData"!=n&&"errMsg"!=n&&(e[n]=t[n]);return e}function a(t){var e={};for(var n in t)e[n]=t[n];return e}function s(t){for(var e="",n=0;n<t.length;n++)t[n].length>e.length&&(e=t[n]);return e}wx.Queue=new function(){this.concurrency=200,this.queue=[],this.tasks=[],this.activeCount=0;var t=this;this.push=function(e){this.tasks.push(new Promise(function(n){var o=function(){t.activeCount++,e().then(function(t){n(t)}).then(function(){t.next()})};t.activeCount<t.concurrency?o():t.queue.push(o)})),console.log("3")},this.all=function(){return console.log("4"),Promise.all(this.tasks)},this.next=function(){console.log("5"),t.activeCount--,t.queue.length>0&&t.queue.shift()()}},wx.Queue.all();var r="1.0.0",c=n.tjconf;""===c.app_key&&console.error("\u8bf7\u5728\u914d\u7f6e\u6587\u4ef6\u4e2d\u586b\u5199\u60a8\u7684app_key"),c.app_key=c.app_key.replace(/\s/g,"");var d,l="",u=function(){var t="";try{t=wx.getStorageSync("h_stat_uuid"),wx.setStorageSync("h_ifo",!0)}catch(n){t="uuid_getstoragesync"}if(t)l=!1;else{t=e(),l=!0;try{wx.setStorageSync("h_stat_uuid",t)}catch(t){wx.setStorageSync("h_stat_uuid","uuid_getstoragesync")}}return t}(),p={},f="",g="",h=0,m="",_=wx.getLaunchOptionsSync(),v=Date.now(),S=(Date.now(),Math.floor(1e7*Math.random()),Date.now(),Math.floor(1e7*Math.random()),0),y="",q="",w="",I=!0,k=["h_SendEvent","h_OnShareAppMessage","h_ShareAppMessage","h_SendSession","h_SendOpenid"];Promise.all([new Promise(function(t){""==w&&wx.login({success:function(e){w=e.code,console.log(w+"---------"),t("")}})}),new Promise(function(t){wx.getNetworkType({success:function(e){t(e)},fail:function(){t("")}})}),new Promise(function(t){c.getLocation?wx.getLocation({success:function(e){t(e)},fail:function(){t("")}}):wx.getSetting({success:function(e){e.authSetting["scope.userLocation"]?(wx.getLocation({success:function(e){t(e)},fail:function(){t("")}}),t("")):t("")},fail:function(){t("")}})})]).then(function(t){""!==t[2]?(p.lat=t[2].latitude||"",p.lng=t[2].longitude||"",p.spd=t[2].speed||""):(p.lat="",p.lng="",p.spd=""),""!==t[1]?p.nt=t[1].networkType||"":p.nt="";var e=a(p);""!==t[0]&&(e.ufo=t[0],y=t[0]),o(e,"init")}),wx.onShow(function(t){m=0,_=t,S=Date.now(),I||(Date.now(),Math.floor(1e7*Math.random()),l=!1,wx.setStorageSync("h_ifo",!1)),I=!1;var e=a(p),n=a(p);e.sm=S-v,t.query.h_share_src&&t.shareTicket&&"1044"===t.scene?(n.tp="h_share_click",new Promise(function(t){"1044"==_.scene?wx.getShareInfo({shareTicket:_.shareTicket,success:function(e){t(e)},fail:function(){t("")}}):t("")}).then(function(t){n.ct=t,o(n,"event")})):t.query.h_share_src&&(n.tp="h_share_click",n.ct="1",o(n,"event")),o(e,"show")}),wx.onHide(function(){var t=a(p);t.dr=Date.now()-S,""===y?wx.getSetting({success:function(e){e.authSetting["scope.userInfo"]?wx.getUserInfo({success:function(e){t.ufo=e,y=e,q=s(e.userInfo.avatarUrl.split("/")),o(t,"hide")}}):o(t,"hide")}}):o(t,"hide")}),wx.onError(function(t){var e=a(p);e.tp="h_error_message",e.ct=t,h++,o(e,"event")});for(var L={h_SendEvent:function(t,e){var n=a(p);""!==t&&"string"==typeof t&&t.length<=255?(n.tp=t,"string"==typeof e&&e.length<=255?(n.ct=String(e),o(n,"event")):"object"==(void 0===e?"undefined":_typeof(e))?(JSON.stringify(e).length>=255&&console.error("\u81ea\u5b9a\u4e49\u4e8b\u4ef6\u53c2\u6570\u4e0d\u80fd\u8d85\u8fc7255\u4e2a\u5b57\u7b26"),n.ct=JSON.stringify(e),o(n,"event")):void 0===e||""===e?o(n,"event"):console.error("\u4e8b\u4ef6\u53c2\u6570\u5fc5\u987b\u4e3aString,Object\u7c7b\u578b,\u4e14\u53c2\u6570\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc7255\u4e2a\u5b57\u7b26")):console.error("\u4e8b\u4ef6\u540d\u79f0\u5fc5\u987b\u4e3aString\u7c7b\u578b\u4e14\u4e0d\u80fd\u8d85\u8fc7255\u4e2a\u5b57\u7b26")},h_OnShareAppMessage:function(t){wx.updateShareMenu({withShareTicket:!0,complete:function(){wx.onShareAppMessage(function(){var e,n=t(),i="",s="";i=void 0!==n.success?n.success:"",s=void 0!==n.fail?n.fail:"",e=void 0!==_.query.h_share_src?void 0!==n.query?(_.query.h_share_src.indexOf(u),n.query+"&h_share_src="+_.query.h_share_src+","+u):(_.query.h_share_src.indexOf(u),"h_share_src="+_.query.h_share_src+","+u):void 0!==n.query?n.query+"&h_share_src="+u:"h_share_src="+u;var r=a(p);return n.query=e,r.ct=n,r.tp="h_share_chain",o(r,"event"),n.success=function(t){r.tp="h_share_status",o(r,"event"),""!==i&&i(t)},n.fail=function(t){r.tp="h_share_fail",o(r,"event"),""!==s&&s(t)},n})}})},h_ShareAppMessage:function(t){var e,n=t,i="",s="";i=void 0!==n.success?n.success:"",s=void 0!==n.fail?n.fail:"",e=void 0!==_.query.h_share_src?void 0!==n.query?(_.query.h_share_src.indexOf(u),n.query+"&h_share_src="+_.query.h_share_src+","+u):(_.query.h_share_src.indexOf(u),"h_share_src="+_.query.h_share_src+","+u):void 0!==n.query?n.query+"&h_share_src="+u:"h_share_src="+u,n.query=e;var r=a(p);r.ct=n,r.tp="h_share_chain",o(r,"event"),n.success=function(t){r.tp="h_share_status",o(r,"event"),""!==i&&i(t)},n.fail=function(t){r.tp="h_share_fail",o(r,"event"),""!==s&&s(t)},wx.updateShareMenu({withShareTicket:!0,complete:function(){wx.shareAppMessage(n)}})},h_SendSession:function(t){if(""!==t&&t){var e=a(p);e.tp="session",e.ct="session",f=t,""===y?wx.getSetting({success:function(t){t.authSetting["scope.userInfo"]?wx.getUserInfo({success:function(t){e.ufo=t,o(e,"event")}}):o(e,"event")}}):(e.ufo=y,""!==y&&(e.gid=""),o(e,"event"))}else console.error("\u8bf7\u4f20\u5165\u4ece\u540e\u53f0\u83b7\u53d6\u7684session_key")},h_SendOpenid:function(t){if(""!==t&&t){g=t;var e=a(p);e.tp="openid",e.ct="openid",o(e,"event")}else console.error("openID\u4e0d\u80fd\u4e3a\u7a7a")}},C=0;C<k.length;C++)!function(t,e){Object.defineProperty(wx,t,{value:e,writable:!1,enumerable:!0,configurable:!0})}(k[C],L[k[C]]);try{var b=wx.getSystemInfoSync();p.br=b.brand||"",p.md=b.model,p.pr=b.pixelRatio,p.sw=b.screenWidth,p.sh=b.screenHeight,p.ww=b.windowWidth,p.wh=b.windowHeight,p.lang=b.language,p.wv=b.version,p.sv=b.system,p.wvv=b.platform,p.fs=b.fontSizeSetting,p.wsdk=b.SDKVersion,p.bh=b.benchmarkLevel||"",p.bt=b.battery||"",p.wf=b.wifiSignal||"",p.lng="",p.lat="",p.nt="",p.spd="",p.ufo=""}catch(A){}}()}}isFromLink(){return this.launchInfo&&this.linkSceneList.indexOf(this.launchInfo.scene)>=0?(console.log("open by code"),!0):null!=this.launchInfo&&null!=this.launchInfo.query&&null!=this.launchInfo.query.customLink}loadAd(e){var n=getCache("zsAd",6e5);if(n)e(n);else if(this.inAdRequest)this.adCbList.push(e);else{this.inAdRequest=!0,this.adCbList.push(e);var o=this,i=this.adUrl+"appad_new/index",a=Math.round((new Date).getTime()/1e3).toString(),s={appid:t.conf.appId,timestamp:a},r=buildSign(s),c=Object.assign({},s,{sign:r});request(i,c,"POST",function(t){if(o.inAdRequest=!1,!t.data)return console.log("\u83b7\u53d6\u5bfc\u51fa\u6570\u636e\u5931\u8d25"+JSON.stringify(t),"\u8bf7\u68c0\u67e5sdk\u914d\u7f6e\u5e73\u53f0\u662f\u5426\u4e3awx,secret\u662f\u5426\u4e3a\u6307\u8272\u540e\u53f0\u914d\u7f6e\u7684secret"),void e([]);for(var n in t.data)t.data[n].sort(function(){return Math.random()>.5?1:-1});var i={more:t.data["position-1"]||[],promotion:t.data["position-2"]||[],indexFloat:t.data["position-3"]||[],banner:t.data["position-4"]||[],indexLeft:t.data["position-7"]||[],gameFloat:t.data["position-8"]||[],endPage:t.data["position-9"]||[],indexLeftFloat:t.data["position-11"]||[],backAd:t.data["position-12"]||[],iosLinkAd:t.data["position-13"]||[]};setCache("zsAd",i);for(var a=0;a<o.adCbList.length;a++)isFun(o.adCbList[a])&&o.adCbList[a](i);o.adCbList=[]},function(){o.inAdRequest=!1,console.log("requestAdData fail");for(var t={more:[],promotion:[],indexFloat:[],banner:[],indexLeft:[],gameFloat:[],endPage:[],indexLeftFloat:[],backAd:[],iosLinkAd:[]},e=0;e<o.adCbList.length;e++)isFun(o.adCbList[e])&&o.adCbList[e](t);o.adCbList=[]},function(){console.log("requestAdData complete")})}}navigate2Mini(t,e=this.userId,n,o,i){var a=t;if("undefined"==typeof wx)return isFun(o)&&o(),void(isFun(i)&&i());this.userId||console.log("\u5f53\u524d\u4e0a\u62a5\u7528\u6237id\u4e0d\u5b58\u5728\uff0c\u8bf7\u68c0\u67e5\u4f20\u5165\u53c2\u6570\u6216\u662f\u5426\u521d\u59cb\u5316sdk");var s=this;a.extraData=a.extraData||{},wx.navigateToMiniProgram({appId:a.appid,path:a.link_path,extraData:a.extraData,success:function(){s.collect(a,e),isFun(n)&&n()},fail:function(){isFun(o)&&o()},complete:function(){isFun(i)&&i()}})}login(e,n){if("undefined"!=typeof wx){var o=this;wx.login({success:function(i){i.code?o.zsLogin(e,n,{code:i.code,appid:t.conf.appId}):(console.log("\u5fae\u4fe1\u767b\u9646\u5931\u8d25"+JSON.stringify(i)),n&&n("\u5fae\u4fe1\u767b\u9646\u5931\u8d25"+JSON.stringify(i)))},fail:function(t){console.log("\u5fae\u4fe1\u767b\u9646\u5931\u8d25"+JSON.stringify(t)),n&&n("\u5fae\u4fe1\u767b\u9646\u5931\u8d25"+JSON.stringify(t))},complete:function(){}})}else this.zsLogin(e,n,{code:1,appid:t.conf.appId})}loadCfg(e,n){var o=null;if("undefined"!=typeof wx){var i=wx.getLaunchOptionsSync();(o=wx.getStorageSync("first_enter_scene"))||(o=i&&i.scene||0,wx.setStorageSync("first_enter_scene",o))}request(this.cfgUrl,{appid:t.conf.appId,scene:o},"POST",function(t){200!=t.code?(console.log("\u83b7\u53d6\u5f00\u5173\u8fd4\u56de\u5931\u8d25"+t.msg),n(t.msg)):(console.log("\u83b7\u53d6\u5f00\u5173\u8fd4\u56de\u6210\u529f"+JSON.stringify(t.data)+"\u76ee\u524d\u573a\u666f\u503c\u4e3a"+o),e(t.data))},function(t){console.log("\u83b7\u53d6\u5f00\u5173\u8bf7\u6c42\u5931\u8d25"+JSON.stringify(t)),n(t)},function(){console.log("loadCfg complete")})}}class n{constructor(){this.adUrl="https://platform.qwpo2018.com/api/",this.loginUrl="https://platform.qwpo2018.com/api/qq_login/index",this.cfgUrl="https://platform.qwpo2018.com/api/list_config/index",this.userId=null,this.srcAppId="",this.launchScene="",this.cfgCbList=[],this.inCfgRequest=!1,this.adCbList=[],this.inAdRequest=!1,this.linkSceneList=[],this.launchInfo=null}sendQQFrom(){if(null!=this.userId){var e=this.adUrl+"qq_jump/index",n={appid:t.conf.appId,from_id:this.srcAppId?this.srcAppId:this.launchScene,user_id:this.userId};request(e,n,"POST",function(){console.log("\u4e0a\u62a5\u6765\u8def\u7edf\u8ba1\u6210\u529f")},function(t){console.log("\u4e0a\u62a5\u6765\u8def\u7edf\u8ba1\u5931\u8d25"+JSON.stringify(t))},function(t){console.log("\u4e0a\u62a5\u6765\u8def\u7edf\u8ba1\u5b8c\u6210",JSON.stringify(t))})}else console.error("\u4e0a\u62a5\u6765\u8def\u7edf\u8ba1\u5931\u8d25\uff0c\u7528\u6237id\u4e0d\u5b58\u5728,\u8bf7\u68c0\u67e5\u662f\u5426\u521d\u59cb\u5316sdk")}zsLogin(t,e,n){request(this.loginUrl,n,"POST",function(n){if(200!=n.code)console.log("\u6307\u8272sdk\u767b\u5f55\u8fd4\u56de\u5931\u8d25"+JSON.stringify(n.msg)),e(n.msg);else{if(!n||!n.data)return e&&e("\u8fd4\u56de\u6570\u636e\u5f02\u5e38"+JSON.stringify(n)),void console.log("\u767b\u5f55\u8fd4\u56de\u6570\u636e\u5f02\u5e38"+JSON.stringify(n));console.log("\u6307\u8272sdk\u767b\u5f55\u6210\u529f,\u8fd4\u56de\u7528\u6237id\uff0c"+n.data.openid+"  \u8bf7\u4f7f\u7528\u8be5id\u521d\u59cb\u5316sdk"),t(n.data.openid)}},function(t){console.log("\u6307\u8272sdk\u767b\u5f55\u8bf7\u6c42\u5931\u8d25"+JSON.stringify(t)),e(t)},function(){console.log("requestAdData complete")})}init(t){if(console.log("zsAdSdk.init,\u7528\u6237id\uff1a"+t),this.userId=t,"undefined"==typeof qq)this.launchScene=1038,this.srcAppId="";else{var e=qq.getLaunchOptionsSync();this.launchScene=e.scene?e.scene:"",this.srcAppId=e.referrerInfo&&e.referrerInfo.appId?e.referrerInfo.appId:"",console.debug("\u6765\u8def\u7edf\u8ba1"+this.srcAppId)}this.sendQQFrom(),this.onAppLaunch()}loadCfg(e,n){var o=Math.round((new Date).getTime()/1e3).toString(),i=0;if("undefined"!=typeof qq){var a=qq.getLaunchOptionsSync();null!=(i=qq.getStorageSync("first_enter_scene"))&&""!=i||(i=a&&a.scene||0,qq.setStorageSync("first_enter_scene",i))}var s={apk_id:t.conf.appId,timestamp:o,scene:Number(i)},r=buildSign(s),c=Object.assign({},s,{sign:r});request(this.cfgUrl,c,"POST",function(t){200!=t.code?(console.log("\u83b7\u53d6\u5f00\u5173\u8fd4\u56de\u5931\u8d25"+t.msg),n(t.msg)):(console.log("\u83b7\u53d6\u5f00\u5173\u8fd4\u56de\u6210\u529f"+JSON.stringify(t.data)),e(t.data))},function(t){console.log("\u83b7\u53d6\u5f00\u5173\u8bf7\u6c42\u5931\u8d25"+JSON.stringify(t)),n(t)},function(){console.log("post loadConfig complete")})}loadAd(e){var n=getCache("zsAd",1e3),o=this;if(n)e(n);else if(this.inAdRequest)this.adCbList.push(e);else{this.inAdRequest=!0,this.adCbList.push(e);var i=o.adUrl+"apk_ad/index",a=Math.round((new Date).getTime()/1e3).toString(),s={apk_id:t.conf.appId,timestamp:a},r=buildSign(s),c=Object.assign({},s,{sign:r});request(i,c,"POST",function(t){if(t.data){o.inAdRequest=!1,t.data.sort(function(){return Math.random()>.5?1:-1}),console.log("res.data",t.data);for(var e=0;e<t.data.length;++e)t.data[e].app_icon=t.data[e].link_img,t.data[e].app_title=t.data[e].link_name,t.data[e].app_desc=t.data[e].link_name,t.data[e].app_desc=t.data[e].link_des,t.data[e].link_id=t.data[e].id,t.data[e].app_id=t.data[e].link_appid,t.data[e].pkg_name=t.data[e].link_page,t.data[e].path=t.data[e].link_path;var n={promotion:t.data};setCache("zsAd",n);for(var i=0;i<o.adCbList.length;i++)isFun(o.adCbList[i])&&o.adCbList[i](n);o.adCbList=[]}},function(){o.inAdRequest=!1,console.log("requestAdData fail");for(var t={promotion:[]},e=0;e<o.adCbList.length;e++)isFun(o.adCbList[e])&&o.adCbList[e](t);o.adCbList=[]},function(){console.log("requestAdData complete")})}}isFromLink(){return this.launchInfo&&this.linkSceneList.indexOf(this.launchInfo.scene)>=0?(console.log("open by code"),!0):null!=this.launchInfo&&null!=this.launchInfo.query&&null!=this.launchInfo.query.customLink}login(e,n){if("undefined"==typeof qq)return console.error("\u672a\u5904\u4e8eQQ\u5e73\u53f0"),void(n&&n("QQ\u767b\u9646\u5931\u8d25"));var o=this;qq.login({success:function(i){i.code?o.zsLogin(e,n,{code:i.code,appid:t.conf.appId}):(console.log("QQ\u767b\u9646\u5931\u8d25"+JSON.stringify(i)),n&&n("QQ\u767b\u9646\u5931\u8d25"))},fail:function(t){console.log("QQ\u767b\u9646\u5931\u8d25"+JSON.stringify(t)),n&&n("QQ\u767b\u9646\u5931\u8d25")},complete:function(){}})}onAppLaunch(){"undefined"==typeof qq||(this.launchInfo=qq.getLaunchOptionsSync(),console.debug("scene:"+this.launchInfo.scene),this.isFromLink()&&console.debug("open by link"))}}class o{constructor(){this.adUrl="https://platform.qwpo2018.com/api/",this.loginUrl="https://platform.qwpo2018.com/api/vivo_login/index",this.cfgUrl="https://platform.qwpo2018.com/api/list_config/index",this.cfgCbList=[],this.inCfgRequest=!1,this.adCbList=[],this.inAdRequest=!1}uploadNavigateEvent(e,n){var o=this.adUrl+"apk_ad/click_log";e={apk_id:t.conf.appId,link_id:e.link_id,user_id:n},request(o,e,"POST",function(){console.log("uploadNavigateEvent success")},function(){console.log("uploadNavigateEvent fail")},function(){console.log("uploadNavigateEvent complete")})}zsLogin(t,e,n){request(this.loginUrl,n,"POST",function(n){200!=n.code?e(n.msg):t(n.data.user_id)},function(t){e(t)},function(){console.log("zsLogin complete")})}loadAd(e){var n=getCache("zsAd",6e5);if(n)e(n);else if(this.inAdRequest)this.adCbList.push(e);else{this.inAdRequest=!0,this.adCbList.push(e);var o=this,i=this.adUrl+"apk_ad/index";request(i,{apk_id:t.conf.appId},"POST",function(t){o.inAdRequest=!1,t.data.sort(function(){return Math.random()>.5?1:-1});for(var e=0;e<t.data.length;++e)t.data[e].app_icon=t.data[e].link_img,t.data[e].app_title=t.data[e].link_name,t.data[e].app_desc=t.data[e].link_name,t.data[e].app_desc=t.data[e].link_des,t.data[e].link_id=t.data[e].id,t.data[e].pkg_name=t.data[e].link_page,t.data[e].path=t.data[e].link_path;var n={promotion:t.data};setCache("zsAd",n);for(var i=0;i<o.adCbList.length;i++)isFun(o.adCbList[i])&&o.adCbList[i](n);o.adCbList=[]},function(){o.inAdRequest=!1,console.log("requestAdData fail");for(var t={promotion:[]},e=0;e<o.adCbList.length;e++)isFun(o.adCbList[e])&&o.adCbList[e](t);o.adCbList=[]},function(){console.log("requestAdData complete")})}}navigate2Mini(e,n,o,i,a){var s=e,r=s.extraData||{};r.from=t.conf.appId;var c=this;qg.navigateToMiniGame({pkgName:s.pkg_name,path:s.path,extraData:r,success:function(){c.uploadNavigateEvent(s,n),console.log("targetMini:",s),isFun(o)&&o()},fail:function(){isFun(i)&&i()}}),console.log("navigateData:"+JSON.stringify(r))}login(e,n){console.log("zsSdk.login..","vivo\u5e73\u53f0\u7248\u672c\u4e3a\uff1a"+qg.getSystemInfoSync().platformVersionCode);var o=this;if(!window.qg)return console.error("\u5f53\u524d\u5e73\u53f0\u5e76\u975eoppo,vivo\uff0c\u65e0\u6cd5\u767b\u5f55"),void(n&&n());qg.getSystemInfoSync().platformVersionCode>=1053?qg.login().then(i=>{if(i.data.token){var a=JSON.stringify(i.data);console.log("vivo\u767b\u5f55\u6210\u529f"+a),o.zsLogin(e,n,{code:i.data.token,apk_id:t.conf.appId})}},t=>{console.log("vivo \u767b\u5f55 fail",JSON.stringify(t)),n&&n()}):qg.authorize({type:"code",success:function(i){console.log("vivo\u767b\u5f55\u6210\u529f"+i),o.zsLogin(e,n,{code:i.code,apk_id:t.conf.appId})},fail:function(t){console.log("vivo \u767b\u5f55 fail",JSON.stringify(t)),n&&n()}})}loadCfg(e,n){request(this.cfgUrl,{apk_id:t.conf.appId},"POST",function(t){200!=t.code?(console.log("\u83b7\u53d6\u5f00\u5173\u914d\u7f6e\u8fd4\u56de\u5931\u8d25"+JSON.stringify(t.msg),"\u8bf7\u68c0\u67e5\u5e73\u53f0\u914d\u7f6e"),n(t.msg)):e(t.data)},function(t){n(t)},function(){console.log("loadCfg complete")})}}class i{constructor(){this.adUrl="https://platform.qwpo2018.com/api/",this.loginUrl="https://platform.qwpo2018.com/api/jrtt_login/index",this.cfgUrl="https://platform.qwpo2018.com/api/list_config/index",this.userId=null,this.srcAppId="",this.adCbList=[],this.inAdRequest=!1}sendAppFrom(){if(t.conf.uploadLog)if(null!=this.userId){if("undefined"!=typeof tt){var e=tt.getLaunchOptionsSync(),n=this.adUrl+"jrtt_jump/index",o={appid:t.conf.appId,from_id:this.srcAppId,user_id:this.userId,from_path:e.query?e.query:"0"};request(n,o,"POST",function(){},function(){console.log('jrtt_jump/index" fail')},function(){console.log('jrtt_jump/index" complete')})}}else console.error("userId is null,\u8bf7\u68c0\u67e5\u662f\u5426\u521d\u59cb\u5316sdk")}zsLogin(t,e,n){request(this.loginUrl,n,"POST",function(n){if(200!=n.code)console.log("\u5934\u6761\u8bf7\u6c42\u767b\u5f55\u8fd4\u56de\u5931\u8d25"+n.msg),e(n.msg);else{if(!n||!n.data)return e&&e("\u8fd4\u56de\u6570\u636e\u5f02\u5e38"+JSON.stringify(n)),void console.log("\u767b\u5f55\u8fd4\u56de\u6570\u636e\u5f02\u5e38"+JSON.stringify(n));console.log("\u5934\u6761\u8bf7\u6c42\u767b\u5f55\u8fd4\u56de\u6210\u529f,\u5f53\u524d\u7528\u6237"+n.data.openid),t(n.data.openid)}},function(t){console.log("\u5934\u6761\u767b\u5f55\u8bf7\u6c42\u5931\u8d25"+JSON.stringify(t)),e(t)},function(){console.log("requestAdData complete")})}init(t){if(console.log("zsAdSdk.init\uff0c\u5f53\u524d\u7528\u6237"+t),this.userId=t,"undefined"==typeof tt)this.srcAppId="0";else{var e=tt.getLaunchOptionsSync();this.launchScene=e.scene?e.scene:"",this.srcAppId=e.referrerInfo&&e.referrerInfo.appId?e.referrerInfo.appId:"0"}this.sendAppFrom()}loadAd(e){var n=getCache("zsAd",1e3);if(n)e(n);else if(this.inAdRequest)this.adCbList.push(e);else{this.inAdRequest=!0,this.adCbList.push(e);var o=this.adUrl+"apk_ad/index",i=Math.round((new Date).getTime()/1e3).toString(),a={apk_id:t.conf.appId,timestamp:i},s=buildSign(a),c=Object.assign({},a,{sign:s}),d=this;request(o,c,"POST",function(t){if(d.inAdRequest=!1,t.data.sort(function(){return Math.random()>.5?1:-1}),console.log("res.data",t.data),!t.data)return console.log("\u83b7\u53d6\u5bfc\u51fa\u6570\u636e\u5931\u8d25"+JSON.stringify(t)),void r;for(var e=0;e<t.data.length;++e)t.data[e].app_icon=t.data[e].link_img,t.data[e].app_title=t.data[e].link_name,t.data[e].app_desc=t.data[e].link_name,t.data[e].app_desc=t.data[e].link_des,t.data[e].link_id=t.data[e].id,t.data[e].app_id=t.data[e].link_appid,t.data[e].pkg_name=t.data[e].link_page,t.data[e].path=t.data[e].link_path;var n={promotion:t.data};setCache("zsAd",n);for(var o=0;o<d.adCbList.length;o++)isFun(d.adCbList[o])&&d.adCbList[o](n);d.adCbList=[]},function(){d.inAdRequest=!1,console.log("requestAdData fail");for(var t={promotion:[]},e=0;e<d.adCbList.length;e++)isFun(d.adCbList[e])&&d.adCbList[e](t);d.adCbList=[]},function(){console.log("requestAdData complete")})}}showMoreGamesModal(e,n){if("undefined"==typeof tt||"function"!=typeof tt.showMoreGamesModal)return;tt.offNavigateToMiniProgram(),tt.offMoreGamesModalClose(),tt.onMoreGamesModalClose(function(t){console.log("modal closed",t)}),tt.onNavigateToMiniProgram(function(t){t&&(console.log("\u662f\u5426\u6709\u8df3\u8f6c\u7684\u5c0f\u6e38\u620f",t),0==t.errCode?isFun(e)&&e():isFun(n)&&n())});const o=tt.getSystemInfoSync();var i={};i.appId=t.conf.appId,"ios"!==o.platform&&tt.showMoreGamesModal({appLaunchOptions:[{extraData:i}],success(t){console.log("showMoreGamesModal success",t.errMsg)},fail(t){console.log("showMoreGamesModal fail",t.errMsg)}})}login(e,n){var o=this;if(!window.tt)return console.error("\u5f53\u524d\u5e73\u53f0\u5e76\u975ett\uff0c\u65e0\u6cd5\u767b\u5f55"),void(n&&n());tt.login({force:!1,success:function(i){console.log(i),i.code||i.anonymousCode?o.zsLogin(e,n,{appid:t.conf.appId,code:i.code||"",anonymous_code:i.anonymousCode}):(console.log("\u5934\u6761\u767b\u5f55\u8fd4\u56de\u5931\u8d25"+JSON.stringify(i)),n&&n("\u5934\u6761\u767b\u9646\u5931\u8d25"))},fail:function(t){console.log("\u5934\u6761\u767b\u5f55\u8bf7\u6c42\u5931\u8d25"+JSON.stringify(t)),n&&n("\u5934\u6761\u767b\u9646\u5931\u8d25")},complete:function(){}})}loadCfg(e,n){request(this.cfgUrl,{apk_id:t.conf.appId},"POST",function(t){200!=t.code?(console.log("\u83b7\u53d6\u5f00\u5173\u5931\u8d25,\u8bf7\u68c0\u67e5\u5e73\u53f0\u914d\u7f6e"+JSON.stringify(t)),n(t.msg)):e(t.data)},function(t){console.log("\u83b7\u53d6\u5f00\u5173\u8bf7\u6c42\u5931\u8d25"+JSON.stringify(t)),n(t)},function(){console.log("loadCfg complete")})}}class a{constructor(){this.adUrl="https://platform.qwpo2018.com/api/",this.loginUrl="https://platform.qwpo2018.com/api/oppo_login/index",this.cfgUrl="https://platform.qwpo2018.com/api/list_config/index",this.userId=null,this.cfgCbList=[],this.inCfgRequest=!1,this.adCbList=[],this.inAdRequest=!1}uploadNavigateEvent(e,n){var o=this.adUrl+"apk_ad/click_log";e={apk_id:t.conf.appId,link_id:e.link_id,user_id:n},request(o,e,"POST",function(){console.log("uploadNavigateEvent success")},function(){console.log("uploadNavigateEvent fail")},function(){console.log("uploadNavigateEvent complete")})}sendAppFrom(){if(null!=this.userId){if("undefined"!=typeof qg){var e=qg.getLaunchOptionsSync(),n=e&&e.referrerInfo?e.referrerInfo.extraData:null;if(n&&n.from){var o=this.adUrl+"oppo_in/index",i={from_id:n.from,oppo_id:t.conf.appId,user_id:this.userId,from_path:n.path?n.path:"0",from_page:e.referrerInfo.package?e.referrerInfo.package:"0"};request(o,i,"POST",function(){console.log("oppo_in success")},function(){console.log("oppo_in fail")},function(){console.log("oppo_in complete")})}}}else console.error("userId is null,\u8bf7\u68c0\u67e5\u662f\u5426\u521d\u59cb\u5316sdk")}zsLogin(t,e,n){request(this.loginUrl,n,"POST",function(n){200!=n.code?(console.log("oppo\u767b\u5f55\u8fd4\u56de\u5931\u8d25"+n.msg),e(n.msg)):t(n.data.user_id)},function(t){console.log("oppo\u767b\u5f55\u8bf7\u6c42\u5931\u8d25"+JSON.stringify(t)),e(t)},function(){console.log("requestAdData complete")})}init(t){this.userId=t,this.sendAppFrom()}loadAd(e){var n=getCache("zsAd",6e5);if(n)e(n);else if(this.inAdRequest)this.adCbList.push(e);else{this.inAdRequest=!0,this.adCbList.push(e);var o=this,i=this.adUrl+"apk_ad/index";request(i,{apk_id:t.conf.appId},"POST",function(t){o.inAdRequest=!1,t.data.sort(function(){return Math.random()>.5?1:-1});for(var e=0;e<t.data.length;++e)t.data[e].app_icon=t.data[e].link_img,t.data[e].app_title=t.data[e].link_name,t.data[e].app_desc=t.data[e].link_name,t.data[e].app_desc=t.data[e].link_des,t.data[e].link_id=t.data[e].id,t.data[e].pkg_name=t.data[e].link_page,t.data[e].path=t.data[e].link_path;var n={promotion:t.data};setCache("zsAd",n);for(var i=0;i<o.adCbList.length;i++)isFun(o.adCbList[i])&&o.adCbList[i](n);o.adCbList=[]},function(){o.inAdRequest=!1,console.log("requestAdData fail");for(var t={promotion:[]},e=0;e<o.adCbList.length;e++)isFun(o.adCbList[e])&&o.adCbList[e](t);o.adCbList=[]},function(){console.log("requestAdData complete")})}}navigate2Mini(e,n,o,i,a){var s=e,r=s.extraData||{};r.from=t.conf.appId;var c=this;qg.navigateToMiniGame({pkgName:s.pkg_name,path:s.path,extraData:r,success:function(){c.uploadNavigateEvent(s,n),console.log("targetMini:",s),isFun(o)&&o()},fail:function(){isFun(i)&&i()}}),console.log("navigateData:"+JSON.stringify(r))}login(e,n){var o=this;if(!window.qg)return console.error("\u5f53\u524d\u5e73\u53f0\u5e76\u975eoppo,vivo\uff0c\u65e0\u6cd5\u767b\u5f55"),void(n&&n());qg.login({success:function(i){0==i.code?o.zsLogin(e,n,{code:i.data.token,apk_id:t.conf.appId}):(console.log("oppo\u767b\u5f55\u5931\u8d25"+JSON.stringify(i)),n&&n("oppo\u767b\u9646\u5931\u8d25"))},fail:function(t){console.log("oppo\u767b\u5f55\u8bf7\u6c42\u5931\u8d25"+JSON.stringify(t)),n&&n("oppo\u767b\u9646\u5931\u8d25")},complete:function(){}})}loadCfg(e,n){request(this.cfgUrl,{apk_id:t.conf.appId},"POST",function(t){200!=t.code?(console.log("oppo\u5f00\u5173\u8fd4\u56de\u5931\u8d25"+t.msg),n(t.msg)):e(t.data)},function(t){console.log("oppo\u5f00\u5173\u8bf7\u6c42\u5931\u8d25"+JSON,stringify(t)),n(t)},function(){console.log("loadCfg complete")})}isExportValid(){return!0}isFromLink(){return!1}}class s{constructor(){this.adUrl="https://platform.qwpo2018.com/api/",this.loginUrl="https://platform.qwpo2018.com/api/bd_login/index",this.cfgUrl="https://platform.qwpo2018.com/api/list_config/index",this.userId=null,this.srcAppId="",this.adCbList=[],this.inAdRequest=!1}sendAppFrom(){if(t.conf.uploadLog)if(null!=this.userId){if("undefined"!=typeof swan){var e=swan.getLaunchOptionsSync(),n=this.adUrl+"bd_jump/index",o={appid:t.conf.appId,from_id:this.srcAppId,user_id:this.userId,from_path:e.query?e.query:"0"};request(n,o,"POST",function(){},function(){console.log('bd_jump/index" fail')},function(){console.log('bd_jump/index" complete')})}}else console.error("userId is null")}zsLogin(t,e,n){request(this.loginUrl,n,"POST",function(n){if(200!=n.code)e&&e(n.msg);else{if(!n||!n.data)return e&&e("\u8fd4\u56de\u6570\u636e\u5f02\u5e38"+JSON.stringify(n)),void console.log("\u767b\u5f55\u8fd4\u56de\u6570\u636e\u5f02\u5e38"+JSON.stringify(n));t(n.data.openid)}},function(t){e(t)},function(){console.log("requestAdData complete")})}init(t){if(console.log("zsAdSdk.init"),this.userId=t,"undefined"==typeof swan)this.srcAppId="0";else{var e=swan.getLaunchOptionsSync();this.launchScene=e.scene?e.scene:"",this.srcAppId=e.referrerInfo&&e.referrerInfo.appId?e.referrerInfo.appId:"0"}this.sendAppFrom()}loadAd(e){var n=getCache("zsAd",1e3);if(n)e(n);else if(this.inAdRequest)this.adCbList.push(e);else{this.inAdRequest=!0,this.adCbList.push(e);var o=this,i=this.adUrl+"apk_ad/index",a=Math.round((new Date).getTime()/1e3).toString(),s={apk_id:t.conf.appId,timestamp:a},r=buildSign(s),c=Object.assign({},s,{sign:r});request(i,c,"POST",function(t){o.inAdRequest=!1,t.data.sort(function(){return Math.random()>.5?1:-1}),console.log("res.data",t.data);for(var e=0;e<t.data.length;++e)t.data[e].app_icon=t.data[e].link_img,t.data[e].app_title=t.data[e].link_name,t.data[e].app_desc=t.data[e].link_name,t.data[e].app_desc=t.data[e].link_des,t.data[e].link_id=t.data[e].id,t.data[e].app_id=t.data[e].link_appid,t.data[e].pkg_name=t.data[e].link_page,t.data[e].path=t.data[e].link_path;var n={promotion:t.data};setCache("zsAd",n);for(var i=0;i<o.adCbList.length;i++)isFun(o.adCbList[i])&&o.adCbList[i](n);o.adCbList=[]},function(){o.inAdRequest=!1,console.log("requestAdData fail");for(var t={promotion:[]},e=0;e<o.adCbList.length;e++)isFun(o.adCbList[e])&&o.adCbList[e](t);o.adCbList=[]},function(){console.log("requestAdData complete")})}}login(e,n){var o=this;if(!window.swan)return console.error("\u5f53\u524d\u5e73\u53f0\u5e76\u975e\u767e\u5ea6\uff0c\u65e0\u6cd5\u767b\u5f55"),void(n&&n());swan.login({success:function(i){console.log(i),i.code?o.zsLogin(e,n,{appid:t.conf.appId,code:i.code}):n&&n("\u767e\u5ea6\u767b\u9646\u5931\u8d25")},fail:function(){n&&n("\u767e\u5ea6\u767b\u9646\u5931\u8d25")},complete:function(){}})}loadCfg(e,n){request(this.cfgUrl,{apk_id:t.conf.appId},"POST",function(t){200!=t.code?n(t.msg):e(t.data)},function(t){n(t)},function(){console.log("loadCfg complete")})}}}(),zs.sdk.initSdkByConf();var sdkStorage={},setStorageSync=function(t,e){sdkStorage[t]=e},getStorageSync=function(t){return sdkStorage[t]},getCache=function(t,e){if(e){var n=getStorageSync(t+"_time");return null==n||Date.now()-Number(n)<e?getStorageSync(t):null}return getStorageSync(t)},setCache=function(t,e){setStorageSync(t,e),setStorageSync(t+"_time",Date.now())},object2Query=function(t){var e=[];for(var n in t)e.push(n+"="+t[n]);return e.join("&")},request=function(t,e,n,o,i){var a=new XMLHttpRequest;a.onreadystatechange=function(){if(4==a.readyState){var t=a.responseText;if(a.status>=200&&a.status<400){var e={};try{e=JSON.parse(t)}catch(n){console.error("json parse error ",t),i(n)}o&&o(e)}else console.error("error ",t),i(t)}},a.timeout=3e3,a.ontimeout=function(t){console.error("error ",t),i(t)},a.open(n,t,!0),"POST"==n?(a.open("POST",t),a.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),a.send(object2Query(e))):a.send()},md5=function(t){var e,n,o,i,a,s,r,c,d,l=function(t,e){return t<<e|t>>>32-e},u=function(t,e){var n,o,i,a,s;return i=2147483648&t,a=2147483648&e,s=(1073741823&t)+(1073741823&e),(n=1073741824&t)&(o=1073741824&e)?2147483648^s^i^a:n|o?1073741824&s?3221225472^s^i^a:1073741824^s^i^a:s^i^a},p=function(t,e,n){return t&e|~t&n},f=function(t,e,n){return t&n|e&~n},g=function(t,e,n){return t^e^n},h=function(t,e,n){return e^(t|~n)},m=function(t,e,n,o,i,a,s){return t=u(t,u(u(p(e,n,o),i),s)),u(l(t,a),e)},_=function(t,e,n,o,i,a,s){return t=u(t,u(u(f(e,n,o),i),s)),u(l(t,a),e)},v=function(t,e,n,o,i,a,s){return t=u(t,u(u(g(e,n,o),i),s)),u(l(t,a),e)},S=function(t,e,n,o,i,a,s){return t=u(t,u(u(h(e,n,o),i),s)),u(l(t,a),e)},y=function(t){var e,n="",o="";for(e=0;e<=3;e++)n+=(o="0"+(t>>>8*e&255).toString(16)).substr(o.length-2,2);return n},q=Array();for(q=function(t){for(var e,n=t.length,o=n+8,i=16*((o-o%64)/64+1),a=Array(i-1),s=0,r=0;r<n;)s=r%4*8,a[e=(r-r%4)/4]=a[e]|t.charCodeAt(r)<<s,r++;return s=r%4*8,a[e=(r-r%4)/4]=a[e]|128<<s,a[i-2]=n<<3,a[i-1]=n>>>29,a}(t=function(t){t=t.replace(/\x0d\x0a/g,"\n");for(var e="",n=0;n<t.length;n++){var o=t.charCodeAt(n);o<128?e+=String.fromCharCode(o):o>127&&o<2048?(e+=String.fromCharCode(o>>6|192),e+=String.fromCharCode(63&o|128)):(e+=String.fromCharCode(o>>12|224),e+=String.fromCharCode(o>>6&63|128),e+=String.fromCharCode(63&o|128))}return e}(t)),s=1732584193,r=4023233417,c=2562383102,d=271733878,e=0;e<q.length;e+=16)n=s,o=r,i=c,a=d,s=m(s,r,c,d,q[e+0],7,3614090360),d=m(d,s,r,c,q[e+1],12,3905402710),c=m(c,d,s,r,q[e+2],17,606105819),r=m(r,c,d,s,q[e+3],22,3250441966),s=m(s,r,c,d,q[e+4],7,4118548399),d=m(d,s,r,c,q[e+5],12,1200080426),c=m(c,d,s,r,q[e+6],17,2821735955),r=m(r,c,d,s,q[e+7],22,4249261313),s=m(s,r,c,d,q[e+8],7,1770035416),d=m(d,s,r,c,q[e+9],12,2336552879),c=m(c,d,s,r,q[e+10],17,4294925233),r=m(r,c,d,s,q[e+11],22,2304563134),s=m(s,r,c,d,q[e+12],7,1804603682),d=m(d,s,r,c,q[e+13],12,4254626195),c=m(c,d,s,r,q[e+14],17,2792965006),s=_(s,r=m(r,c,d,s,q[e+15],22,1236535329),c,d,q[e+1],5,4129170786),d=_(d,s,r,c,q[e+6],9,3225465664),c=_(c,d,s,r,q[e+11],14,643717713),r=_(r,c,d,s,q[e+0],20,3921069994),s=_(s,r,c,d,q[e+5],5,3593408605),d=_(d,s,r,c,q[e+10],9,38016083),c=_(c,d,s,r,q[e+15],14,3634488961),r=_(r,c,d,s,q[e+4],20,3889429448),s=_(s,r,c,d,q[e+9],5,568446438),d=_(d,s,r,c,q[e+14],9,3275163606),c=_(c,d,s,r,q[e+3],14,4107603335),r=_(r,c,d,s,q[e+8],20,1163531501),s=_(s,r,c,d,q[e+13],5,2850285829),d=_(d,s,r,c,q[e+2],9,4243563512),c=_(c,d,s,r,q[e+7],14,1735328473),s=v(s,r=_(r,c,d,s,q[e+12],20,2368359562),c,d,q[e+5],4,4294588738),d=v(d,s,r,c,q[e+8],11,2272392833),c=v(c,d,s,r,q[e+11],16,1839030562),r=v(r,c,d,s,q[e+14],23,4259657740),s=v(s,r,c,d,q[e+1],4,2763975236),d=v(d,s,r,c,q[e+4],11,1272893353),c=v(c,d,s,r,q[e+7],16,4139469664),r=v(r,c,d,s,q[e+10],23,3200236656),s=v(s,r,c,d,q[e+13],4,681279174),d=v(d,s,r,c,q[e+0],11,3936430074),c=v(c,d,s,r,q[e+3],16,3572445317),r=v(r,c,d,s,q[e+6],23,76029189),s=v(s,r,c,d,q[e+9],4,3654602809),d=v(d,s,r,c,q[e+12],11,3873151461),c=v(c,d,s,r,q[e+15],16,530742520),s=S(s,r=v(r,c,d,s,q[e+2],23,3299628645),c,d,q[e+0],6,4096336452),d=S(d,s,r,c,q[e+7],10,1126891415),c=S(c,d,s,r,q[e+14],15,2878612391),r=S(r,c,d,s,q[e+5],21,4237533241),s=S(s,r,c,d,q[e+12],6,1700485571),d=S(d,s,r,c,q[e+3],10,2399980690),c=S(c,d,s,r,q[e+10],15,4293915773),r=S(r,c,d,s,q[e+1],21,2240044497),s=S(s,r,c,d,q[e+8],6,1873313359),d=S(d,s,r,c,q[e+15],10,4264355552),c=S(c,d,s,r,q[e+6],15,2734768916),r=S(r,c,d,s,q[e+13],21,1309151649),s=S(s,r,c,d,q[e+4],6,4149444226),d=S(d,s,r,c,q[e+11],10,3174756917),c=S(c,d,s,r,q[e+2],15,718787259),r=S(r,c,d,s,q[e+9],21,3951481745),s=u(s,n),r=u(r,o),c=u(c,i),d=u(d,a);return(y(s)+y(r)+y(c)+y(d)).toLowerCase()},isFun=function(t){return"function"==typeof t},buildSign=function(t,e){e=e||!0;for(var n=Object.keys(t).sort(),o="",i=0;i<n.length;i++)o+=n[i]+":"+t[n[i]];e&&(o+=zs.sdk.conf.secret);var a=md5(o);return a.toLowerCase()},checkNetDomain=function(){request("https://changshazhise01-1254961065.cos.ap-guangzhou.myqcloud.com/cp/cpDomainName/domain.json",null,"get",function(t){t&&t.domain&&(console.log("\u83b7\u53d6\u5230\u7f51\u4e0a\u5e7f\u544a\u57df\u540d"+t.domain),zs.sdk.domain=t.domain)},function(t){console.log("\u8bf7\u6c42\u7f51\u7edc\u57df\u540d\u5931\u8d25"+JSON.stringify(t))})};checkNetDomain();