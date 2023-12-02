import { BaseView } from "../../../cfw/view";
import PrivacyMgr from "../PrivacyMgr";
import PrivacyC from "../PrivacyC";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PrivacyPopView extends BaseView {

    @property(cc.Button)
    backBtn: cc.Button = null;
    @property(cc.Label)
    content: cc.Label = null;

    @property(cc.Node)
    labelTemplate: cc.Node = null;

    @property(cc.Layout)
    layout: cc.Layout = null;
    // 更多参数说明请访问: https://ldc2.ccbox.com/doc/?nav=zh-as-2-4-0
    static text: string = ''
    constructor() { super(); }
    protected prevX = 0
    protected prevY = 0;
    protected model: PrivacyMgr;
    protected controller: PrivacyC;
    onEnter() {
        // this.backBtn.clickHandler = cc.Handler.create(this, this.onBackBtnClick)
        // cc.loader.load(PrivacyPopView.text, cc.Handler.create(this, this.loadFinish), null, cc.Loader.TEXT)
        // this.content.on(cc.Event.MOUSE_DOWN, this, this.startScrollText);
        // this.loadFinish(this.model.getText())
        this.addList(this.model.getTextList())

    }

    addList(text: string[]) {
        console.log('addList text ',text)
        for (let index = 0; index < text.length; index++) {
            const element = text[index];
            let node = cc.instantiate(this.labelTemplate)
            let label = node.getComponent(cc.Label)
            label.string = element;
            this.layout.node.addChild(node)
        }
    }

    // private startScrollText(e: Event): void {
    //     this.prevX = this.content.mouseX;
    //     this.prevY = this.content.mouseY;

    //     cc.stage.on(cc.Event.MOUSE_MOVE, this, this.scrollText);
    //     cc.stage.on(cc.Event.MOUSE_UP, this, this.finishScrollText);
    // }

    /* 停止滚动文本 */
    // private finishScrollText(e: Event): void {
    //     cc.stage.off(cc.Event.MOUSE_MOVE, this, this.scrollText);
    //     cc.stage.off(cc.Event.MOUSE_UP, this, this.finishScrollText);
    // }

    /* 鼠标滚动文本 */
    // private scrollText(e: Event): void {
    //     var nowX: number = this.content.mouseX;
    //     var nowY: number = this.content.mouseY;
    //     this.content.scrollX += this.prevX - nowX;
    //     this.content.scrollY += this.prevY - nowY;

    //     this.prevX = nowX;
    //     this.prevY = nowY;
    // }

    loadFinish(text: string) {
        // console.log('text ', text)
        // let w = this.content.node.width;
        // let fs = this.content.fontSize + 2;
        // let count = Math.floor(w / fs)
        // let line = Math.ceil(text.length / count)
        // this.content.node.height = line * fs;
        this.content.string = text;

        // this.content.size(500, 750);
        // this.content.x = cc.stage.width - this.content.width >> 1;
        // this.content.y = cc.stage.height - this.content.height >> 1;
    }
    onEnable(): void {
    }

    onBackBtnClick() {
        // window['ML'].cc.CloseScene(this, null)
        this.hide();
    }

    onDisable(): void {
    }

    // static OpenView(text: string) {
    //     PrivacyPopView.text = text;
    //     window['ML'].cc.OpenScene("view/PrivacyPopView.scene")
    // }
}