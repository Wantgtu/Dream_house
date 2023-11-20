
import { ModuleManager } from "./cfw/module";
import { ModuleConfig } from "./config/ModuleConfig";
import UIManager from "./cfw/ui";
import { UI_CONFIG } from "./config/UIConfig";
import SDKManager from "./sdk/sdk/SDKManager";
import { ChannelID, ResultState } from "./sdk/sdk/SDKConfig";
import { SDKData } from "./sdk/SDKData";
import { engine } from "./engine/engine";
import { TimeManager } from "./cfw/time";
import LobbyC from "./logic/lobby/LobbyC";
import { BaseStorage } from "./cfw/storage";
import LangManager from "./cfw/tools/LangManager";
import { GameText } from "./config/GameText";
import User from "./logic/user/User";
import CMgr from "./sdk/channel-ts/CMgr";
import UmengEventID from "./config/UmengEventID";
import Debug from "./cfw/tools/Debug";
const { ccclass, property } = cc._decorator;
@ccclass
export default class Main extends cc.Component {

    @property([cc.JsonAsset])
    gameInfo: cc.JsonAsset[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    loading: cc.Prefab = null;

    onLoad() {
        engine.resizeUI()
        BaseStorage.LOCAL_NAME = 'LoveAndHouse'
        User.instance().login()
        // console.log('SDKManager')
        SDKManager.init(ChannelID.DEV, SDKData)
        SDKManager.getChannel().setVisibleSize(cc.view.getVisibleSize())

        // console.log('SDKManager.getChannel().channelID ', SDKManager.getChannel().channelID)
        CMgr.setHelper(SDKManager.getChannel().channelID)
        Debug.log('Main init' + 'ss', 20)
        // console.log('ModuleConfig count ', ModuleConfig.length)
        ModuleManager.init(BaseStorage.LOCAL_NAME, ModuleConfig)
        // console.log('this.gameInfo.length', this.gameInfo.length)
        for (let index = 0; index < this.gameInfo.length; index++) {
            const element = this.gameInfo[index];
            ModuleManager.addFile(element)
        }
        // console.log("Main onLoad ")
        let lang = 'zh'
        LangManager.instance().addData(GameText[lang])
        UIManager.instance().init(this.content, UI_CONFIG)
        // GameC.instance().intoLayer()
        CMgr.helper.startGame();
        CMgr.helper.trackEvent(UmengEventID.enter_game)
        Debug.timeStart();

        // let url = 'http://www.baidu.com'
        // url = 'https://www.sarsgame.com/config/config.js'
        // url = 'https://gitee.com/sarsgame/love-and-house2-d/blob/master/jsconfig.json'
        // Utils.sendHttpRequest(url, '', (error, data) => {
        //     console.log('data is ', error, data)
        // })
        // SDKHelper.addScript(url, '20', (err, data) => {
        //     console.log('err ', err, 'data', data)
        //     console.log('config ', window['lc_sdk'])

        //     console.log('config.sdk ', window['lc_sdk'].data)
        // })
        // let x = this.update.bind(this)
        // let y = this.update.bind(this)
        // console.log(' x == y ', x === y)
        // x = () => { }
        // y = () => { }
        // console.log(' x == y ', x === y)

        // this.on(this.update.bind(this), 1)
    }

    update(dt: number) {
        TimeManager.instance().update(dt)
    }

    on(func: Function, num: number) {
        console.log('on', num)
        console.log(func.caller === this.update)
        console.log('22')
        console.log(func)
    }

    off(func: Function, num: number) {
        console.log('off', num)
        console.log(func)
    }
}