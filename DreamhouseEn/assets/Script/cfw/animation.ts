import Component3D from "../engine/Component3D";

export abstract class BaseAnimation extends Component3D {

    count: number = -1;// -1 循环播放 1 播放一次

    actionName: string = ''//动作名称

    autoPlay: boolean = true;//是否自动播放

    //帧事件回调函数
    protected eventCallback: (actionName: any) => void;

    //动作结束回调函数。
    protected finishCallback: (actionName: any) => void;

    protected initFlag: boolean = false;

    setCount(count: number) {
        this.count = count;
    }

    isPlaying() {
        return false;
    }

    getActionName() {
        return this.actionName;
    }

    setActionName(name: string) {
        this.actionName = name;
    }


    setAutoPlay(flag: boolean) {
        this.autoPlay = flag;
    }


    /**
     * -1 表示使用配置文件中的默认值;
     *	0 表示无限循环
     *	>0 表示循环次数
     * 播放动画
     * @param actionName 动作的名称
     * 
     * @param count 
     */
    abstract play(actionName: string, count?: number);

    /**
     * 
     * @param func 帧事件触发回调。
     */
    setEventCallback(func) {
        this.eventCallback = func;
    }

    /**
     * 
     * @param func 动作播放完毕的回调
     */
    setFinishCallback(func: (actionName: string) => void) {
        this.finishCallback = func;
    }


    onActionFinished() {

        if (this.finishCallback) {
            // cc.log(' onActionFinished finish ')
            this.finishCallback(this.actionName)
        }
    }

    onEventFinish() {
        // cc.log(' onEventFinish finish ')
        if (this.eventCallback) {
            this.eventCallback(this.actionName)
        }
    }

    /**
     * 暂停
     */
    pause() {

    }

    /**
     * 恢复
     */
    resume() {

    }

    /**
     * 停止
     */
    stop(name?: string) {

    }

}