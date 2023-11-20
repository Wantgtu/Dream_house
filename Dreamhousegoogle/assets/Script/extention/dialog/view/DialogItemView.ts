import { BaseItemView } from "../../../cfw/view";
import DialogItemModel from "../model/DialogItemModel";
import PersonItemModel from "../../../logic/person/model/PersonItemModel";
import { OPPSITE_DIR } from "../../../cfw/tools/Define";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DialogItemView extends BaseItemView {
    @property(cc.Label)
    label: cc.Label = null;


    @property(cc.Label)
    personName: cc.Label = null;

    @property([cc.Sprite])
    personIcon: cc.Sprite[] = [];

    @property([cc.Node])
    person: cc.Node[] = [];
    protected model: DialogItemModel;
    content() {
        this.node.scale = 0;
        this.label.string = this.model.getContent();
        let dir = this.model.getDir();
        let person: PersonItemModel = this.model.getPerson();
        if (person) {
            this.person[dir].active = true;
            let odir = OPPSITE_DIR[dir]
            this.person[odir].active = false;
            this.personName.string = person.getName();
            let icon = person.getEmoji(this.model.getEmoji())
            this.setSpriteAtlas(this.personIcon[dir], person.getModuleID(), person.getIcon(), icon)
        }
        cc.tween(this.node).to(0.2, { scale: 1.2 }).to(0.2, { scale: 1 }).start();
    }
}