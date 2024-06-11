import { BaseView } from "../../../../cfw/view";
import LoadingC from "../LoadingC";
import { engine } from "../../../../engine/engine";
import { LoadResItem } from "../../../../cfw/res";


const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingView extends BaseView {



	@property(cc.Label)
	tipLabel: cc.Label = null;

	@property(cc.ProgressBar)
	progressBar: cc.ProgressBar = null;

	controller: LoadingC;
	onEnter() {

		this.controller.on(LoadingC.LOAD_RES, this.updateProgress, this)
		this.controller.on(LoadingC.LOAD_RESET, this.reset, this)
		this.controller.on(LoadingC.LOAD_ITEM, this.loadItem, this)
		this.reset()

	}

	loadItem(m: LoadResItem) {
		this.tipLabel.string = m.getTip();
	}

	onEnable() {
		this.controller.reload();
	}

	onExit() {
		this.controller.off(LoadingC.LOAD_RES, this.updateProgress, this)
		this.controller.off(LoadingC.LOAD_RESET, this.reset, this)
		this.controller.off(LoadingC.LOAD_ITEM, this.loadItem, this)
	}



	reset() {
		if (this.progressBar)
			this.progressBar.progress = 0;

	}

	updateProgress(step: number) {
		if (this.progressBar)
			this.progressBar.progress = step / this.controller.getTotalCount();
	}
}