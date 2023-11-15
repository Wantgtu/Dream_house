
import OperateObserver from "../../gevent/operate/OperateObserver";


export default class CloseGameTip extends OperateObserver {
    // static FINISH: string = 'finish_game_tip'
    static CLOSE_TIP: string = 'close_game_tip'
    start() {
        this.emit(CloseGameTip.CLOSE_TIP)
    }
}