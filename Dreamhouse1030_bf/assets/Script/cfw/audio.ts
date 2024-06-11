
import { LocalValue } from "./local";
import { GEventProxy } from "./event";
import { ModuleManager } from "./module";
import { ResType, ResItem } from "./res";
import MusicManager from "../engine/MusicManager";
import { SoundManager } from "../engine/SoundManager";
export enum SoundType {
    NO_LIMIT,//没有限制
    HAS_OTHER,//如果有其他声音不能播放
    CLOSE_OTHER,//播放直接关闭其他声音
}
export default class AudioManager {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }
    private soundVolume: LocalValue;
    private musicVolume: LocalValue;
    private musicFlag: LocalValue;
    private soundFlag: LocalValue;
    protected musicMgr: MusicManager = new MusicManager();
    protected soundMgr: SoundManager = new SoundManager();
    protected gEventProxy: GEventProxy = new GEventProxy()
    constructor() {
        this.soundVolume = new LocalValue('soundVolume', 1);
        this.musicFlag = new LocalValue('musicFlag', 1);
        this.musicVolume = new LocalValue('musicVolume', 1);
        this.soundFlag = new LocalValue('soundFlag', 1)
    }

    //停止某个音效
    stopSound(path: string) {
        this.soundMgr.stop(path)
    }

    //停止所有音效
    stopAllSound() {
        this.soundMgr.stopAll();
    }

    //获取音效音量
    getSoundVolume() {
        if (!this.soundVolume) {
            return 1;
        }
        return this.soundVolume.getValue();
    }


    //暂停
    pause() {
        if (!this.getMusicFlag()) {
            return;
        }

        this.musicMgr.pause()


    }
    //恢复
    resume() {
        if (!this.getMusicFlag()) {
            return;
        }
        this.musicMgr.resume()
    }

    //设置音效开关标识
    setSoundFlag(flag: boolean) {
        let num = flag ? 1 : 0;
        this.soundFlag.setValue(num);
        // console.log('setSoundFlag value ', this.soundFlag.getValue(), flag)
        // this.soundFlag.setValue(f ? 1 : 0)
    }
    //设置音效音量
    setSoundVolume(num: number) {
        if (!this.soundVolume) {
            return;
        }
        this.soundVolume.setValue(num);
        this.soundMgr.setVolume(num)
    }
    //获取音乐音量
    getMusicVolume() {
        if (!this.musicVolume) {
            return 1;
        }
        return this.musicVolume.getValue();
    }

    //获取音乐开关标识
    getMusicFlag() {
        if (!this.musicFlag) {
            return false;
        }
        let num = this.musicFlag.getValue();
        return num == 1 ? true : false;
    }
    //设置音乐音量
    setMusicVolume(num: number) {
        if (!this.musicVolume) {
            return;
        }
        this.musicVolume.setValue(num);
        this.musicMgr.setVolume(num)
    }
    getSoundFlag() {
        // console.log('getSoundFlag this.soundFlag.getValue()  ', this.soundFlag.getValue())
        return this.soundFlag.getValue() == 1 ? true : false
    }
    //设置音乐开关标识
    setMusicFlag(flag: boolean) {
        if (!this.musicFlag) {
            return;
        }
        let num = flag ? 1 : 0;
        this.musicFlag.setValue(num);

    }



    stopMusic() {
        if (!this.musicMgr.isPlaying()) {
            return;
        }
        // this.openMusicName = null;
        this.musicMgr.stop()
    }


    /**
     * 
     * @param moduleID 
     * @param path 
     * @param isLoop 
     */
    playMusic(moduleID: string, path: string, isLoop: boolean = true) {
        ModuleManager.loadRes(moduleID, path, ResType.AudioClip, (err, item: ResItem) => {
            if (err) {
                return;
            }
            this.musicMgr.play(path, item.getRes(), isLoop)
        })

    }


    playSound(moduleID: string, path: string, playCount: number = 1, type: SoundType) {
        if (!this.getSoundFlag()) {
            return;
        }

        ModuleManager.loadRes(moduleID, path, ResType.AudioClip, (err, item: ResItem) => {
            if (err) {
                return;
            }
            this.soundMgr.play(path, item.getRes(), playCount, type)
        })


    }

}