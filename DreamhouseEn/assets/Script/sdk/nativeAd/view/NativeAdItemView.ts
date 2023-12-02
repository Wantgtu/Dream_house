
import BaseNativeAdItemModel from "../../sdk/base/BaseNativeAdItemModel";
import SDKManager from "../../sdk/SDKManager";
import CMgr from "../../channel-ts/CMgr";
import OVNativeAdMgr from "../OVNativeAdMgr";
import { BaseItemView } from "../../../cfw/view";
import Utils from "../../../cfw/tools/Utils";
import { ModuleID } from "../../../config/ModuleConfig";
import { ResType, ResItem } from "../../../cfw/res";
import { ModuleManager } from "../../../cfw/module";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NativeAdItemView extends BaseItemView {

    @property(cc.Sprite)
    adImage: cc.Sprite = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Node)
    button: cc.Node = null;

    @property({
        type: cc.Component.EventHandler,
        displayName: "回调函数"
    })
    callback1 = new cc.Component.EventHandler();

    protected model: BaseNativeAdItemModel;
    start() {
        if (SDKManager.getChannel().hasNativeAd()) {
            if (!CMgr.helper.isVersion()) {
                return false;
            }
            SDKManager.getChannel().showNativeAd(0, (list: BaseNativeAdItemModel[]) => {
                console.log('NativeAdItemView list.length 111111111111111111 ', list.length)
                if (list.length > 0) {
                    this.setModel(list[Utils.random(0, list.length)])
                } else {
                    SDKManager.getChannel().showNativeAd(1, (list: BaseNativeAdItemModel[]) => {
                        console.log('NativeAdItemView list.length 222222222222222222222 ', list.length)
                        if (list.length > 0) {
                            this.setModel(list[Utils.random(0, list.length)])
                        } else {
                            if (this.callback1)
                                this.callback1.emit([])
                            else
                                this.node.active = false;
                        }
                    })
                }
            });
        } else {
            if (this.callback1)
                this.callback1.emit([])
            else
                this.node.active = false;
        }


    }

    setModel(item) {
        this.model = item;
        this.node.active = true
        // console.log('item.imgUrl =========== ', this.model.getIcon())
        this.title.string = this.model.getDesc();
        let image = this.model.getRandomImage();
        if (image) {
            ModuleManager.loadRes(ModuleID.RES, image, ResType.Remote, (err, item: ResItem) => {
                if (err || !cc.isValid(this.node)) {
                    console.log(' err ', err)
                    return;
                }
                if (this.adImage)
                    this.adImage.spriteFrame = new cc.SpriteFrame(item.getRes())
            });
        }


    }

    onButtonClick() {
        if (this.callback1)
            this.callback1.emit([])
        if (this.model)
            SDKManager.getChannel().reportAdClick(this.model.getID())
    }

    onBackClick() {
        if (this.model) {
            let num = CMgr.helper.getNativeCloseNum()
            console.log(' onback$VButtonClick num ', num)
            if (num > 0) {
                let curNum = OVNativeAdMgr.instance().getCloseAdCount();
                console.log(' onback$VButtonClick curNum ', curNum)
                if (curNum < num) {
                    this.onButtonClick()
                    OVNativeAdMgr.instance().updateCloseAdCount(1)
                } else {
                    if (this.callback1)
                        this.callback1.emit([])
                }
            } else {
                if (this.callback1)
                    this.callback1.emit([])
            }
        } else {
            if (this.callback1)
                this.callback1.emit([])
        }

        // this.callback1.emit([])
    }
}
