
const { ccclass, property } = cc._decorator;

@ccclass
export default class LayerMgr extends cc.Component {

    @property({
        type: cc.Component.EventHandler,
        displayName: "内容处理函数"
    })
    delegate = new cc.Component.EventHandler();

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property
    totalCount: number = 0;

    private contents: cc.Node[] = []

    start() {
        let temp = this.getItem()
        let count = temp.childrenCount;
        for (let index = 0; index < count; index++) {
            let node = new cc.Node()
            let widget = node.addComponent(cc.Widget)
            node.width = this.node.width
            node.height = this.node.height;
            widget.left = 0;
            widget.right = 0;
            widget.top = 0;
            widget.bottom = 0;
            this.node.addChild(node)
            this.contents[index] = node;
        }
        cc.log(' content count ', this.contents.length)
        this.init();
    }

    getItem() {
        return cc.instantiate(this.prefab)
    }

    init() {
        for (let index = 0; index < this.totalCount; index++) {
            let item: cc.Node = this.getItem()

            if (!item) {
                continue;
            }
            this.node.addChild(item)
            let count = item.childrenCount
            cc.log(' count == ', count)

            if (count > 0) {
                let j = 0;
                let list = item.children;
                while (list.length > 0) {
                    // cc.log(' list.length  11111 ', list.length)
                    let element = list[0]
                    if (element) {
                        element.parent = null;
                        // cc.log(' list.length 2222222 ', list.length)
                        this.contents[j].addChild(element)
                        j++;
                    } else {
                        cc.warn(' element is null ', j)
                        break;
                    }

                }
            } else {

            }

            this.delegate.emit([this, index, item]);
        }
    }

    // update (dt) {}
}
