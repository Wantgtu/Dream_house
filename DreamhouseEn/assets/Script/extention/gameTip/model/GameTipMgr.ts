import { ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import GameTipModel from "./GameTipModel";
import OperateObserver from "../../gevent/operate/OperateObserver";
/**
* %SheetName%
**/
export default class GameTipMgr extends OperateObserver {

    static SHOW_TIP: string = 'show_game_tip'


    static STAT_TIP: string = 'start_game_tip'
    static NEXT_TIP: string = 'next_game_tip'
    protected tipID: number = 0;

    start(id: number) {
        this.tipID = id;
        this.emit(GameTipMgr.STAT_TIP, id)
    }

    getTipID() {
        return this.tipID;
    }

    // next() {
    //     this.emit(GameTipMgr.NEXT_TIP, OperateType.OPEN_TIP)
    // }

    // close() {
    //     this.emit(GameTipMgr.FINISH, OperateType.CLOSE_TIP)
    // }

    // hide() {

    //     this.emit(GameTipMgr.CLOSE_TIP)
    //     this.tipID = 0;


    // }
    protected gameTipModelMgr: ModelManager<GameTipModel> = new ModelManager()


    initData() {
        this.gameTipModelMgr.initWithData(ModuleManager.dataManager.get(GameTipModel.CLASS_NAME), GameTipModel)

    }

    getGameTipModel(id) { return this.gameTipModelMgr.getByID(id) }

    getGameTipModelList() { return this.gameTipModelMgr.getList() }




}