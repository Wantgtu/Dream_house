import { BaseView } from "../../../cfw/view";
import { EventName } from "../../../config/Config";
import ItemModel from "../model/ItemModel";
import Utils from "../../../cfw/tools/Utils";
import { OPPSITE } from "../../../cfw/tools/Define";
import ItemMgr from "../model/ItemMgr";
import { GEvent } from "../../../cfw/event";
import LevelMgr from "../../level/model/LevelMgr";
import SoundMgr from "../../sound/model/SoundMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemFlyAnim extends BaseView {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    itemID: number = 0;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    protected buffer: cc.Sprite[] = []
    protected move1: number = 300;
    protected move2: number = 600;
    protected iconPos: cc.Vec2;
    onLoad() {
        this.iconPos = this.icon.node.parent.convertToWorldSpaceAR(this.icon.node.getPosition())
        this.iconPos = this.node.convertToNodeSpaceAR(this.iconPos)
        this.gEventProxy.on(EventName.UPDATE_ITEM_NUM, this.updateContent, this)
        this.showNum(ItemMgr.instance().getItemModel(this.itemID))
    }

    updateContent(m: ItemModel, point: cc.Vec2, obj?: cc.Sprite) {

        // console.log('updateContent')
        // console.log(m)
        // console.log(point)
        if (m.getID() == this.itemID) {
            if (!point) {
                this.showNum(m)
            } else {
                point = this.node.convertToNodeSpaceAR(point)
                this.createMoneys(m, point, obj)
            }
        }
    }
    createMoneys(m: ItemModel, p: cc.Vec2, obj?: cc.Sprite) {
        if (obj) {
            let img: cc.Sprite = this.getImage(obj);
            img.spriteFrame = obj.spriteFrame;
            img.node.parent = this.node;
            img.node.x = p.x;
            img.node.y = p.y;
            this.waiwei(img, m);
        } else {
            let len = 50;
            for (let index = 0; index < 10; index++) {
                let x = Utils.random(len, len * 2)
                let y = Utils.random(len, len * 2)
                let img: cc.Sprite = this.getImage();
                img.node.x = p.x;
                img.node.y = p.y;
                let tx = p.x + x * OPPSITE[Utils.random(0, OPPSITE.length)];
                let ty = p.y + y * OPPSITE[Utils.random(0, OPPSITE.length)];
                if (!img.node.parent)
                    this.node.addChild(img.node)
                cc.tween(img.node).to(this.move1 / 1000, { x: tx, y: ty })
                    .call(() => {
                        this.waiwei(img, m)
                    })
                    .start();
            }
        }

        let time = (this.move1 + this.move2) / 1000
        cc.tween(this.node).delay(time).call(() => {
            this.showNum(m)
        }).start();
    }
    waiwei(img: cc.Sprite, m: ItemModel) {
        let tp = this.iconPos
        let tx = tp.x;
        let ty = tp.y;
        let time = Utils.random(this.move2, this.move2 + 200)
        cc.tween(img.node)
            .to(time / 1000, { x: tx, y: ty })
            .call(() => {
                this.animFinish(img, m)
            })
            .start();
    }
    showNum(m: ItemModel) {
        if (this.label) {
            this.label.string = Utils.getShortStr(m.getNum(), 100);
        }

        if (this.progressBar) {
            let percent = m.getNum() / LevelMgr.instance().getTotalExp()
            cc.log(' percent ', percent)
            this.progressBar.progress = percent;
        }

        GEvent.instance().emit(EventName.UPDATE_ITEM_NUM_FINISH, m)
    }

    animFinish(img: cc.Sprite, m: ItemModel) {
        this.buffer.push(img)
        img.node.active = false;
        SoundMgr.instance().playSound(m.getSound())

    }
    getImage(obj?: cc.Sprite) {
        let img: cc.Sprite = this.buffer.length > 0 ? this.buffer.shift() : new cc.Node().addComponent(cc.Sprite);
        if (obj) {
            img.spriteFrame = obj.spriteFrame;
        } else {
            img.spriteFrame = this.icon.spriteFrame;
        }

        img.node.scale = 1;
        img.node.active = true;
        return img;
    }
}