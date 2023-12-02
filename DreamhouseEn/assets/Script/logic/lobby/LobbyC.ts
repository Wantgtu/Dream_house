
import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import { BundleManager, ModuleManager } from "../../cfw/module";
import { ResType } from "../../cfw/res";
import LoadingC from "../public/loading/LoadingC";
import ItemC from "../item/ItemC";
import SceneC from "../scene/SceneC";
import GameC from "../game/GameC";
import TaskC from "../task/TaskC";
import TaskMgr from "../task/model/TaskMgr";
import LevelC from "../level/LevelC";
import StartC from "../start/StartC";
import { ItemState } from "../../cfw/model";
import SoundMgr from "../sound/model/SoundMgr";
import { SoundID, EventName } from "../../config/Config";
import User from "../user/User";
import ActivityC from "../activity/ActivityC";
import WeeklyC from "../weekly/WeeklyC";
import GameEventAdapter from "../../extention/gevent/GameEventAdapter";
import { GEvent } from "../../cfw/event";
import BuildItemModel from "../scene/model/BuildItemModel";
import DailyTaskMgr from "../dailytask/model/DailyTaskMgr";
import ActivityMgr from "../activity/model/ActivityMgr";
import LangManager from "../../cfw/tools/LangManager";
import { XlsxDataManager } from "../../cfw/xlsx";
import { EventCheckType } from "../../extention/gevent/GameEventConfig";
import SceneMgr from "../scene/model/SceneMgr";
import PrivacyC from "../../sdk/agreement/PrivacyC";
import CMgr from "../../sdk/channel-ts/CMgr";
import SDKManager from "../../sdk/sdk/SDKManager";
import GiftBoxC from "../giftbox/GiftBoxC";
import UmengEventID from "../../config/UmengEventID";
import Debug from "../../cfw/tools/Debug";
let preloads: string[] = ['public/public', 'texture/props', 'bg/person']
export default class LobbyC extends BaseController {


    constructor() {
        super();
        // GEvent.instance().on(EventName.NEW_BUILD_OPEN, this.newBuildOpen, this)
    }

    getCurID() {
        return SceneMgr.instance().getCurID()
    }

    intoLayer() {
        let flag = BundleManager.instance().hasBundle(ModuleID.PUBLIC)
        // console.log('SceneC flag ', model.getBundle(), flag)
        if (flag) {
            this.showView()
        } else {
            LoadingC.instance().addItem('data/game_info', ResType.Json, ModuleID.RES, 'Load the game configuration')
            LoadingC.instance().addItem('data/activity_info', ResType.Json, ModuleID.RES, 'Load the active configuration')
            LoadingC.instance().addItem('data/game_lang_zh', ResType.Json, ModuleID.RES, 'Load the text configuration')

            LoadingC.instance().addItem(ModuleID.PUBLIC, ResType.AssetBundle, ModuleID.RES, 'Load common bundle')
            LoadingC.instance().addItem(ModuleID.CRAZY_CLICK, ResType.AssetBundle, ModuleID.RES, 'Load egg smashing bundle')
            LoadingC.instance().addItem(ModuleID.GAME, ResType.AssetBundle, ModuleID.RES, 'Load game bundle')
            LoadingC.instance().addItem(ModuleID.AUDIO, ResType.AssetBundle, ModuleID.RES, 'Load sound bundle')
            if (StartC.instance().isState(ItemState.NOT_GET)) {
                LoadingC.instance().addItem(ModuleID.START, ResType.AssetBundle, ModuleID.RES, 'Load init bundle')
            }
            console.log('SDKManager.getChannel().hasNativeAd() ', SDKManager.getChannel().hasNativeAd())
            if (SDKManager.getChannel().hasNativeAd()) {
                LoadingC.instance().addItem(ModuleID.nativeAd, ResType.AssetBundle, ModuleID.RES, 'Load nativeAd bundle')
            }
            if (CMgr.helper.hasInstallApp()) {
                LoadingC.instance().addItem(ModuleID.install, ResType.AssetBundle, ModuleID.RES, 'Load install bundle')
            }
            LoadingC.instance().addItem('public/public', ResType.SpriteAtlas, ModuleID.PUBLIC, 'Load common large image')
            LoadingC.instance().addItem('texture/props', ResType.SpriteAtlas, ModuleID.GAME, 'Load game large image')
            LoadingC.instance().addItem('bg/person', ResType.SpriteAtlas, ModuleID.GAME, 'Load head large image')
            // LoadingC.instance().addItem('data/guide_config', ResType.Json, ModuleID.RES, 'Load config')
            LoadingC.instance().intoLayer(() => {
                let data = ModuleManager.dataManager.get('game_lang_zh').getData()
                // console.log("data['data']", data)
                LangManager.instance().addData(data)

                if (CMgr.helper.hasAgreement()) {
                    PrivacyC.instance().intoLayer(() => {
                        if (StartC.instance().isState(ItemState.NOT_GET)) {
                            StartC.instance().intoLayer()
                        } else {

                            this.firstShow();
                        }
                    })
                } else {
                    if (StartC.instance().isState(ItemState.NOT_GET)) {
                        StartC.instance().intoLayer()
                    } else {

                        this.firstShow();
                    }
                }


            })
        }

    }

    firstShow() {
        let time = Debug.timeEnd();
        CMgr.helper.trackEvent(UmengEventID.enter_lobby, { time: time })
        TaskMgr.instance();
        this.showView()
        ItemC.instance().intoLayer()
        LevelC.instance().intoLayer()
        GiftBoxC.instance().intoLayer()
        CMgr.helper.sheduleGame();
       
    }

    showView() {
        ViewManager.pushUIView({
            path: 'prefabs/LobbyView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.ROOT,
            controller: this,
            func: () => {

            }
        })
    }


    init() {


        setTimeout(() => {
            if (SoundMgr.instance().getMusicFlag()) {
                SoundMgr.instance().playMusic(SoundID.MusicBg)
            }

            // console.log(' User.instance().getLoginCount() ', User.instance().getLoginCount())
            if (User.instance().getLoginCount() > 1) {
                if (!GameEventAdapter.instance().isOpen()) {
                    ActivityC.instance().showOfflineView()
                    CMgr.helper.firstIntoLobby()
                }
            }
            if (!GameEventAdapter.instance().isOpen()) {
                WeeklyC.instance().intoLayer()
            }

            DailyTaskMgr.instance();
            ActivityMgr.instance();
        }, 500);

    }

    intoTask() {
        TaskC.instance().intoLayer()
    }

    intoGame() {
        GameC.instance().intoLayer()
    }

    addScene(parent: cc.Node, sceneID: number, func?: Function) {
        SceneC.instance().intoLayer(parent, sceneID, func)
    }

    leftScene() {
        SceneMgr.instance().left();
    }

    rightScene() {
        SceneMgr.instance().right();
    }

}
