import { engine } from "./engine";

export default class MusicManager {

    protected tempName: string;

    getMaxNum() {
        return engine.audioEngine.getMaxAudioInstance();
    }

    play(name: string, res: any, isLoop: boolean) {
        if (this.tempName == name) {
            return;
        }
        this.stop();
        this.tempName = name;
        let audioId = engine.audioEngine.playMusic(res, isLoop);
        if (!isLoop) {
            engine.audioEngine.setFinishCallback(audioId, this.stop.bind(this, name));
        }
    }

    pause() {
        engine.audioEngine.pauseMusic();
    }

    resume() {
        engine.audioEngine.resumeMusic();
    }

    stop() {

        if (!this.tempName) {
            return;
        }

        engine.audioEngine.stopMusic();
        this.tempName = null;

    }

    setVolume(count: number) {

        engine.audioEngine.setMusicVolume(count);

    }

    isPlaying() {
        return engine.audioEngine.isMusicPlaying();
    }

    clear() {
        this.stop()
    }

}