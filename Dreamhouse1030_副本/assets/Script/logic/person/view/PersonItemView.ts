import { BaseItemView } from "../../../cfw/view";
import PersonItemModel from "../model/PersonItemModel";
import { ModuleManager } from "../../../cfw/module";
import { ResType, ResItem } from "../../../cfw/res";
import Utils from "../../../cfw/tools/Utils";
import { PersonState } from "../../../config/Config";
import { CCPoolManager } from "../../../cocos/ccpool";
let ts: number[] = [0.1, 0.2, 0.3, 0.15, 0.25]
const { ccclass, property } = cc._decorator;

@ccclass
export default class PersonItemView extends BaseItemView {
    @property(cc.Sprite)
    personIcon: cc.Sprite = null;

    protected model: PersonItemModel;
    protected state: PersonState = PersonState.BOEN;

    callback: Function;
    protected duration: number = 0;
    onEnter() {
        let children = this.personIcon.node.children;
        for (let index = 0; index < children.length; index++) {
            const element = children[index];
            if (element.opacity == 255) {
                element.opacity = 0;
            }

        }
    }

    protected eye: cc.Node = null;
    content() {
        if (this.eye) {
            cc.Tween.stopAllByTarget(this.eye)
            if (this.eye.opacity == 255) {
                this.eye.opacity = 0;
            }
            this.eye = null;
        }

        let person = this.model
        this.setSpriteAtlas(this.personIcon, person.getModuleID(), person.getIcon(), person.getSpriteFrame())
       

        this.personIcon.node.scaleY = 0;
        this.changeState(PersonState.BOEN)
        let eye = this.personIcon.node.getChildByName(this.model.getID())
        if (eye) {
           
            this.eye = eye;
            this.eye.active = true
            this.blind(eye)
        }
    }

    private blind(eye: cc.Node) {
        cc.tween(eye)
            .delay(Utils.random(2, 5))
            .call(() => {
                eye.opacity = 255;
            })
            .delay(0.2)
            .call(() => {
                eye.opacity = 0;
                this.blind(eye)
            })
            .start();
    }


    changeState(s: PersonState) {
        this.state = s;
        let t: number = 0;
        cc.Tween.stopAllByTarget(this.personIcon.node)
        this.personIcon.node.scale = 1;
        this.personIcon.node.angle = 0;
        switch (this.state) {
            case PersonState.BOEN:
                t = ts[Utils.random(0, ts.length)]
                cc.tween(this.personIcon.node)
                    .by(t, { scaleY: 0.3 })
                    .by(t, { scaleY: -0.3 })
                    .call(() => {
                        this.next();
                    })
                    .start();
                this.duration = t * 2;
                break;
            case PersonState.OUT:
                this.duration = 0.2;
                cc.tween(this.personIcon.node)
                    .to(this.duration, { scaleY: 0 })
                    .call(() => {
                        // this.next();
                    }).start();
                break;
            case PersonState.TIP:
                t = 0.15
                cc.tween(this.personIcon.node)
                    .by(t, { angle: 20, scaleY: 0.1 })
                    .by(t, { angle: -20, scaleY: -0.1 })
                    .call(() => {
                        this.next();
                    })
                    .start();
                this.duration = t * 2;
                break;
            case PersonState.STAND:
                t = Utils.random(1, 4) / 2
                cc.tween(this.personIcon.node)
                    .by(t, { scaleY: 0.1 })
                    .by(t, { scaleY: -0.1 })
                    .call(() => {
                        this.next();
                    })
                    .start();
                this.duration = t * 2;
                break;
        }
    }

    getDuration() {
        return this.duration;
    }

    next() {
        if (this.callback) {
            this.callback(this.state)
        }
        cc.tween(this.personIcon.node)
            .to(0.1, { scale: 1 })
            .call(() => {
                this.changeState(PersonState.STAND)
            })
            .start();

    }

    recover() {
        CCPoolManager.instance().put(this.node)
        cc.Tween.stopAllByTarget(this.personIcon.node)
        if (this.eye) {
            cc.Tween.stopAllByTarget(this.eye)
            if (this.eye.opacity == 255) {
                this.eye.opacity = 0;
            }
            this.eye = null;
        }
    }
}