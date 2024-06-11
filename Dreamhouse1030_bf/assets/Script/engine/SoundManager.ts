import { TSMap } from "../cfw/struct";
import { engine } from "./engine";
import { SoundType } from "../cfw/audio";

export class SoundManager {

    protected sourcePool: { [key: string]: number[] } = {}

    // private soundMap: TSMap<string, number> = new TSMap();

    protected playingName: string[] = []
    getMaxNum() {
        return engine.audioEngine.getMaxAudioInstance();
    }
    /**
     * 
     * @param name 
     * @param res 
     * @param canMulply 不可以同时播放两个以上
     */
    play(name: string, res: any, playCount: number = 1, type: SoundType = SoundType.NO_LIMIT) {
        // cc.log(' play sound name ', name, ' canMulply ', canMulply)
        let audioId = -1;
        switch (type) {
            case SoundType.CLOSE_OTHER:
                let runningName: string = this.playingName[type]
                if (runningName) {
                    this.stop(runningName)
                    this.playingName[type] = null;
                }
                break;
            case SoundType.HAS_OTHER:
                if (this.playingName[type]) {
                    return;
                }
                break;
            case SoundType.NO_LIMIT:

                break;
        }
        audioId = engine.audioEngine.playEffect(res, playCount);
        if (audioId) {
            this.playingName[type] = name;
            this.addSound(name, audioId)
            if (playCount == 1)
                engine.audioEngine.setFinishCallback(audioId, this.over.bind(this, type));

        }
    }

    addSound(name: string, audioId: number) {
        if (!this.sourcePool[name]) {
            this.sourcePool[name] = []
        }

        this.sourcePool[name].push(audioId)
    }

    get(name: string, isDelete: boolean = false) {
        // console.log(' this.sourcePool.has(name) ', this.sourcePool.has(name))
        // if (this.sourcePool[name]) {
        let list = this.sourcePool[name]
        if (list && list.length > 0) {
            if (isDelete) {
                return list.shift();
            } else {
                return list[0]
            }
        }
        // }
        return 0;
    }

    over(type: SoundType) {
        let name = this.playingName[type]
        // this.soundMap.remove(name)
        this.get(name, true);
        this.playingName[type] = null;
    }

    pause(name: string) {
        for (const key in this.sourcePool) {
            let list = this.sourcePool[key]
            for (let index = 0; index < list.length; index++) {
                const audioId = list[index];
                engine.audioEngine.pauseEffect(audioId);
            }
        }

    }

    resume(name: string) {
        for (const key in this.sourcePool) {
            let list = this.sourcePool[key]
            for (let index = 0; index < list.length; index++) {
                const audioId = list[index];
                engine.audioEngine.resumeEffect(audioId);
            }
        }
    }

    stop(name: string) {
        let audioId = this.get(name, true);
        // console.log('SoundManager stop name ', name, ' audioId ', audioId)
        if (audioId >= 0 || typeof (audioId) == 'object') {
            engine.audioEngine.stopEffect(audioId);
        }
    }

    setVolume(count: number) {
        engine.audioEngine.setEffectsVolume(count);
    }

    stopAll() {
        for (const key in this.sourcePool) {
            let list = this.sourcePool[key]
            for (let index = 0; index < list.length; index++) {
                const audioId = list[index];
                engine.audioEngine.stopEffect(audioId);
            }
        }
        // this.soundMap.clear();
    }

    isPlaying() {
        return false;
    }


    clear() {
        this.stopAll();
        this.sourcePool = {}
        // this.soundMap.clear()
    }

}