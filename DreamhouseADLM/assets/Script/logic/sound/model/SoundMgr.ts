import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import SoundItemModel from "./SoundItemModel";
import AudioManager from "../../../cfw/audio";
import { ModuleID } from "../../../config/ModuleConfig";
import { LocalValue } from "../../../cfw/local";
import SDKManager from "../../../sdk/sdk/SDKManager";
/**
* %SheetName%
**/
export default class SoundMgr extends BaseModel {

	protected soundItemModelMgr: ModelManager<SoundItemModel> = new ModelManager()
	protected verb: LocalValue
	protected musicID: number = 1;
	constructor() {
		super();
		this.verb = new LocalValue('SoundMgrverb', 1)
	}

	changeBerb() {
		let v = this.verb.getValue();
		if (v == 1) {
			this.verb.setValue(0)
		} else {
			this.verb.setValue(1)
		}
	}

	getBerb() {
		return this.verb.getValue();
	}

	initData() {
		this.soundItemModelMgr.initWithData(ModuleManager.dataManager.get(SoundItemModel.CLASS_NAME), SoundItemModel)

	}

	getSoundItemModel(id) { return this.soundItemModelMgr.getByID(id) }

	getSoundItemModelList() { return this.soundItemModelMgr.getList() }


	stopMusic() {
		AudioManager.instance().stopMusic()
	}

	getMusicID() {
		return this.musicID;
	}

	playMusic(id: number = this.musicID, readDB: boolean = false) {

		let m: SoundItemModel = this.getSoundItemModel(id)
		if (m) {
			this.musicID = id;
			if (readDB) {
				if (AudioManager.instance().getMusicFlag()) {
					AudioManager.instance().playMusic(ModuleID.AUDIO, m.getRes())
				}
			} else {
				AudioManager.instance().playMusic(ModuleID.AUDIO, m.getRes())
			}

		}
	}

	getMusicFlag() {
		return AudioManager.instance().getMusicFlag()
	}

	changeAudioState() {
		this.changeMusicsState()
		this.changeSoundState()
	}

	changeMusicsState() {
		AudioManager.instance().setMusicFlag(AudioManager.instance().getMusicFlag() ? false : true)
		if (AudioManager.instance().getMusicFlag()) {
			this.playMusic(this.musicID, false)
		} else {
			AudioManager.instance().stopMusic()
		}
	}

	setAudioState(s: boolean) {
		AudioManager.instance().setSoundFlag(s)
		AudioManager.instance().setMusicFlag(s)
	}

	getSoundFlag() {
		return AudioManager.instance().getSoundFlag()
	}

	changeSoundState() {
		AudioManager.instance().setSoundFlag(AudioManager.instance().getSoundFlag() ? false : true)
	}



	playSound(id: number) {
		let m: SoundItemModel = this.getSoundItemModel(id)
		if (m) {
			// console.log(' m.getPlayCount() ', m.getPlayCount(), id, m.getRes())
			AudioManager.instance().playSound(ModuleID.AUDIO, m.getRes(), parseInt(m.getPlayCount()), parseInt(m.getType()))
		}
	}

	stopSound(id: number) {
		let m: SoundItemModel = this.getSoundItemModel(id)
		if (m) {
			// console.log('SoundMgr stopSound ')
			AudioManager.instance().stopSound(m.getRes())
		}
	}


	vibrateShort() {
		if (this.getBerb()) {
			SDKManager.getChannel().vibrateShort()
		}
	}

	rewardOpen() {
		console.log('rewardOpen ')
		// SoundMgr.instance().stopMusic()
		if (this.getMusicFlag()) {
			// this.setAudioState(false)
			this.stopMusic()
		}

	}

	rewardClose() {
		console.log('rewardClose ')
		// AudioMgr.instance().playMusic(SoundID.LKT_Gameplay_Soundtrack)
		if (this.getMusicFlag()) {
			// this.setAudioState(true)
			this.playMusic(SoundMgr.instance().getMusicID(), true)
		}


	}

}