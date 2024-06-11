declare namespace zs {

    class sdk {
        /**这是一个初始化sdk配置的方法
        * @param inConf "{channel:"wx",appId:"1234567",secret:"指色后台secret[仅微信使用] 非官方平台appSecret"}"
        */
        static initSdkByConf(inConf: inConf)
        /**初始化sdk接口需传入用户id  user_id为用户唯一标识，通过官方登录获得（sdk登录会调用官方登录并返回标识） */
        static init(user_id)
        /**登录接口，可传入登录成功，失败的函数 login(function(userId){sdk.init(userId)},function(){console.log(登录失败)}) */
        static login(success: Function, fail?: Function);
        /**获取导出数据的接口,可传入成功回调  loadAd(function(data){})   wx使用 */
        static loadAd(callback: Function);
        /**获取后台配置的接口,可传入成功失败回调 */
        static loadCfg(success: Function, fail?: Function);
        /**小程序跳转接口  可传入数据项，用户id，成功失败回调  wx使用*/
        static navigate2Mini(row, openid?, success?: Function, fail?: Function, complete?: Function);
        /**vivo  oppo  上报原生事件的接口  无需调用 */
        static uploadNavigateEvent(success: Function, fail: Function);
        /**头条展示更多好玩接口 根据需求调用*/
        static showMoreGamesModal(success?: Function, fail?: Function);
        /**无需调用 */
        static isFromLink();
    }

    interface inConf {
        channel: string;
        appId: string;
        secret?: string;
    }
}