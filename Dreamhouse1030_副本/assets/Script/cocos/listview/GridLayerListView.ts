import GridListView from "./GridListView";
let INIT_POS = 'initPos'
let LIST = 'list'
const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.ScrollView)
/**
 * 1. 继承自GrideListView 采用分层的方式管理节点。
 * 2. 分层加载节点
 * 3. 如果有label组件可以设置为Char模式减少dc。
 */
export default class GridLayerListView extends GridListView {

    private contents: cc.Node[] = []

    private root: cc.Node = null;

    init() {
        this.initParam()
        this.initContent();
        this.addItems()
    }

    setLayer(node: cc.Node, content: cc.Node) {
        node.width = content.width
        node.height = content.height;
        node.anchorX = content.anchorX;
        node.anchorY = content.anchorY;
    }

    initContent() {
        let content = this.content;
        if (this.contents.length == 0) {
            let temp = this.getItem()
            let count = temp.childrenCount;
            cc.log(' count ', count)
            let node = new cc.Node()
            this.setLayer(node, content)
            this.root = node;
            content.addChild(node)
            for (let index = 0; index < count; index++) {
                let node = new cc.Node()
                this.setLayer(node, content)
                content.addChild(node)
                this.contents[index] = node;
            }
            this.putItem(temp)
        } else {
            let node = this.root;
            this.setLayer(node, content)
            for (let index = 0; index < this.contents.length; index++) {
                let node = this.contents[index]
                this.setLayer(node, content)
            }
        }

        cc.log(' child count ', this.content.childrenCount, content.height)
    }

    protected setItemPosition(item, x, y) {
        item.setPosition(x, y);
        let list = item[LIST];
        if (list) {
            // cc.log(' x ', x, ' y ', y, list.length)
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                let initPos = element[INIT_POS];

                if (initPos) {
                    element.x = x + initPos.x;
                    element.y = y + initPos.y;
                    // cc.log(' setItemPosition opacity ', element.x, element.y,element.opacity)
                }
            }
        }

    }

    protected setItemPositionX(item, posx) {
        item.x = posx
        let list = item[LIST];
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                let initPos = element[INIT_POS];
                if (initPos) {
                    element.x = posx + initPos.x;
                }
            }
        }
    }

    protected setItemPositionY(item, y) {
        item.y = y
        let list = item[LIST];
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                let initPos = element[INIT_POS];
                if (initPos) {
                    element.y = y + initPos.y;
                    // cc.log(' setItemPositionY opacity ', element.x, element.y,element.opacity)
                }
            }
        }
    }
    protected setItemActive(item: cc.Node, flag: boolean) {
        item.active = flag;
        let list = item[LIST];
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                element.active = flag;
            }
        }
    }
    // protected setItemOpacity(item:cc.Node, opacity) {
    //     let flag :boolean = opacity == 0? false:true
    //     item.active = flag;
    //     // item.opacity = opacity
    //     let list = item[LIST];
    //     if (list) {
    //         for (let index = 0; index < list.length; index++) {
    //             const element = list[index];
    //             // element.opacity = opacity
    //             element.active = flag;
    //         }
    //     }
    // }
    protected addChild(item) {
        if (!item.parent) {
            let count = item.childrenCount
            item[LIST] = [] // 还是要得到子节点的索引 以便处理位置，可见度等信息
            if (count > 0) {
                let j = 0;
                let list = item.children;
                while (list.length > 0) {
                    let element: cc.Node = list[0]
                    if (element) {
                        let widget = element.getComponent(cc.Widget)
                        if (widget) {
                            element.removeComponent(cc.Widget)
                        }
                        element.parent = this.contents[j];
                        // this.contents[j].addChild(element)
                        //通过初始化，获得子节点的本地坐标。
                        element[INIT_POS] = cc.v2(element.x, element.y)
                        item[LIST].push(element)
                        j++;
                    } else {
                        cc.warn(' element is null ', j)
                        break;
                    }

                }
            }
            item.parent = this.root
        } else {
            this.setItemActive(item, true)
        }
    }
}
