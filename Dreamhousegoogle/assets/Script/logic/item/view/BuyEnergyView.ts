import ItemMgr from "../model/ItemMgr";
import { BaseView } from "../../../cfw/view";
import ItemC from "../ItemC";
import { DIR } from "../../../cfw/tools/Define";
import GuideMgr from "../../../extention/guide/GuideMgr";
import GameEventAdapter from "../../../extention/gevent/GameEventAdapter";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyEnergyView extends BaseView {

	@property({ type: cc.Button, displayName: "backBtnButton" })
	backBtnButton: cc.Button = null;

	@property({ type: cc.Sprite, displayName: "adBtnSprite" })
	adBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "adBtnButton" })
	adBtnButton: cc.Button = null;

	@property({ type: cc.Label, displayName: "costNumLabel" })
	costNumLabel: cc.Label = null;

	@property({ type: cc.Sprite, displayName: "tokenBtnSprite" })
	tokenBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "tokenBtnButton" })
	tokenBtnButton: cc.Button = null;

	@property(cc.Node)
	cion_icon: cc.Node = null;



	protected model: ItemMgr;
	protected controller: ItemC;
	onLoad() {
		let cost = this.model.getBuyEnergyCost();
		this.costNumLabel.string = '' + cost;
		if (GameEventAdapter.instance().isOpen()) {
			// this.cion_icon.active = false
			this.costNumLabel.string = '免费'
		} else {

		}
	}




	onDestroy() {

	}

	onbackBtnButtonClick() {
		this.hide();
	}

	onadBtnButtonClick() {
		this.controller.buyEnergy(DIR.LEFT)
	}

	ontokenBtnButtonClick() {
		
		this.controller.buyEnergy(DIR.RIGHT)
		GuideMgr.instance().notify('onTokenBtnClick')
	
	}



}