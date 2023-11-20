import SDKManager from "../../sdk/sdk/SDKManager";
import { SDKState } from "../../sdk/sdk/SDKConfig";
import RecorderC from "./RecorderC";
import RedTipMgr from "../../extention/redtip/RedTipMgr";
import { RedTipType } from "../../config/Config";


/**
 * 1. 手动开启
 * 2. 手动分享
 * 3. 自动停止后手动分享
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class RecorderComp extends cc.Component {


    @property(cc.SpriteFrame)
    recordStart: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    recordEnd: cc.SpriteFrame = null;

    @property(cc.Sprite)
    recordIcon: cc.Sprite = null;


    @property(cc.Label)
    desc: cc.Label = null;
    // @property(cc.Label)
    // label: cc.Label = null;

    protected func: Function;
    start() {

        this.node.active = SDKManager.getChannel().hasRecorder()
        if (this.node.active) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this)
            let recorder = SDKManager.getChannel().getRecorder()
            this.func = this.changeState.bind(this);
            recorder.on(this.func)
            this.startRecorder();
            // this.setState(recorder.getState())
            // this.onButtonClick()
        }


    }
    startRecorder() {
        let recorder = SDKManager.getChannel().getRecorder()
        recorder.start();
    }
    onDestroy() {
        let recorder = SDKManager.getChannel().getRecorder()
        if (recorder) {
            recorder.off(this.func)
        }
    }

    changeState(s: number) {
        console.log('changeState s ', s)
        this.setState(s)
    }

    setState(s: number) {
        // this.state = s;
        switch (s) {
            case SDKState.stop:

                if (this.recordIcon) {
                    this.recordIcon.spriteFrame = this.recordEnd;
                }
                this.desc.string = '录制完成'
                RedTipMgr.instance().addRedTip(RedTipType.HAS_RECORDER)
                this.onButtonClick();
                break;
            case SDKState.start:
                this.desc.string = '录制中...'
                RedTipMgr.instance().removeRedTip(RedTipType.HAS_RECORDER)
                if (this.recordIcon) {
                    this.recordIcon.spriteFrame = this.recordStart;
                }

                break;

        }



    }




    update(dt) {

    }

    onButtonClick() {
        // let recorder = SDKManager.getChannel().getRecorder()
        // recorder.start();
        RecorderC.instance().intoLayer()
    }

}
