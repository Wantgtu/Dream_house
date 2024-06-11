import { CCPoolManager } from "../ccpool";


const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.ScrollView)
/**
 * 1. listview 思想
 * 2. 根据item的宽高和content的宽高还有间距计算列数或者行数
 * 3. 会打断合批
 */
export default class GridListView extends cc.Component {

    //预制体文件
    @property(cc.Prefab)
    prefab: cc.Prefab = null;


    //如果使用对象池，需要自己做好初始化工作
    @property
    poolKey: string = ''

    @property({
        type: cc.Component.EventHandler,
        displayName: "内容处理函数"
    })
    delegate = new cc.Component.EventHandler();


    @property({
        type: cc.Component.EventHandler,
        displayName: "初始化结束"
    })
    initFinish = new cc.Component.EventHandler();

    @property({
        type: cc.Component.EventHandler,
        displayName: "更新函数"
    })
    delegateUpdate = new cc.Component.EventHandler();

    //道具总个数
    @property
    totalCount: number = 0;

    @property
    spaceX: number = 5;

    @property
    spaceY: number = 5;

    //缓存对象
    protected buffList: cc.Node[] = []

    protected scrollView: cc.ScrollView;

    //scrollView 的content 
    protected content: cc.Node;

    //当前显示的内容
    protected items: any[] = [];

    //最后的位置
    protected lastContentPos: number = 0;

    //根据计算获得的content的宽度或者高度
    protected contentSize: number = 0;
    //位置指针
    protected position_back: number = 0;
    //位置指针
    protected position_front: number = 0;

    protected offset: number = 0;

    //可见区域的宽或者高
    protected bufferSize: number = 0;

    //道具宽或者高+间距
    protected itemSize: number = 0;

    protected spaceSize: number = 0;


    protected bufferZone: number = 0;

    //默认是一行或者一列
    protected cellNum: number = 1;

    //需要显示的行数或者列数 根据道具总数和 每行显示个数得到
    protected needCount: number = 0;

    start(): void {
        if (this.poolKey) {
            cc.log("使用对象池 ", this.poolKey)
        }
        this.scrollView = this.getComponent(cc.ScrollView)
        if (this.scrollView && this.prefab) {
            this.content = this.scrollView.content;
            this.content.removeAllChildren()
            // this.scrollView.node.on('scrolling', this.updateItem, this);
            this.init();
        }

    }

    update() {
        this.updateItem();
    }


    onDestroy(): void {
        this.clear();
    }

    getItems() {
        return this.items;
    }


    //长度改变后的 重置
    reset(totalCount: number): void {
        this.scrollView.stopAutoScroll();
        //没有用到对象池，所以当内容比之前少的时候需要移除，所以就直接移除了。
        this.clear();
        this.totalCount = totalCount;
        this.init();
        if (this.scrollView.vertical) {
            this.scrollView.scrollToTop();
        } else {
            this.scrollView.scrollToLeft();
        }
    }

    //主动调用更新内容
    updateItems(): void {
        if (this.delegateUpdate) {
            for (let index = 0; index < this.items.length; index++) {
                let element = this.items[index];
                this.delegateUpdate.emit([element]);
            }
        }
    }

    protected clear(): void {
        if (this.items && this.items.length > 0) {
            this.items.forEach(element => {
                // element.opacity = 0;
                this.setItemActive(element, false)
                this.putItem(element);
            });
        }
        this.items.length = 0;
    }

    //回收节点
    protected putItem(item) {
        if (this.poolKey) {
            CCPoolManager.instance().put(item)
        } else {
            this.buffList.push(item)
        }

    }

    //获得节点 可以修改为通过对象池获取。
    protected getItem() {
        if (this.poolKey) {
            return CCPoolManager.instance().get(this.poolKey, () => {
                return cc.instantiate(this.prefab)
            })
        } else {
            if (this.prefab) {
                return this.buffList.length > 0 ? this.buffList.shift() : cc.instantiate(this.prefab)
            } else {
                cc.error(' 预制体没有赋值 ')
                return null;
            }
        }
    }



    protected init() {
        this.initParam()
        this.addItems()
    }

    /**
     * 初始化用到的参数
     */
    protected initParam() {
        cc.log('道具总数   ', this.totalCount)
        // let bufferSize = 0;// 显示区域的大小。
        this.position_back = -1;
        this.position_front = 0;
        let temp = this.getItem()
        this.itemSize = 0;
        let visibleWidth: number = 0;
        let view: cc.Node = null;
        for (let index = 0; index < this.scrollView.node.childrenCount; index++) {
            const element = this.scrollView.node.children[index];
            if (element.getComponent(cc.Mask)) {
                view = element;
                break;
            }
        }

        if (!view) {
            cc.error('不能没有Mask组件')
            return;
        }

        if (this.scrollView.vertical) {
            this.itemSize = (temp.height + this.spaceY);
            this.spaceSize = (temp.width + this.spaceX);
            this.bufferSize = view.height;
            this.content.width = view.width;
            this.content.anchorX = 0.5;
            this.content.anchorY = 1;
            this.content.x = 0;
            this.content.y = view.height / 2;
            visibleWidth = this.content.width;

        } else {
            this.itemSize = (temp.width + this.spaceX);
            this.spaceSize = (temp.height + this.spaceY);
            this.bufferSize = view.width;
            this.content.height = view.height;
            this.content.anchorX = 0;
            this.content.anchorY = 0.5;
            this.content.x = view.width / 2;
            this.content.y = 0
            visibleWidth = this.content.height;

        }


        this.cellNum = Math.floor(visibleWidth / this.spaceSize)
        if (this.cellNum <= 0) {
            this.cellNum = 1;
        }
        cc.log('可视区域宽度  ', visibleWidth, ' 道具宽度+间距 ', this.itemSize, '  应该显示列数 ', this.cellNum)
        this.putItem(temp)

        this.bufferSize += this.itemSize;// 多生成一个用于平滑显示。
        let size = Math.floor(this.totalCount / this.cellNum);

        this.needCount = this.totalCount % this.cellNum != 0 ? size + 1 : size;
        cc.log('应该显示行数：   ', this.needCount)
        this.contentSize = this.needCount * this.itemSize;

        if (this.scrollView.vertical) {
            this.content.height = this.contentSize;
        } else {
            this.content.width = this.contentSize;
        }

        this.scrollView.scrollTo(cc.v2(0, 1), 0);
    }

    /**
     * 添加道具
     */
    protected addItems() {
        let bufferSize = this.bufferSize;
        let size = Math.floor(bufferSize / this.itemSize);
        //实际需要显示的行数或者列数
        let spawnCount = bufferSize % this.itemSize == 0 ? size : size + 1;
        if (spawnCount > this.needCount) {
            spawnCount = this.needCount;
        }
        cc.log('实际显示行数   ', spawnCount)
        let letx = 0
        if (this.scrollView.vertical) {
            letx = 0 - ((this.cellNum - 1) * this.spaceSize) / 2;
        } else {
            letx = ((this.cellNum - 1) * this.spaceSize) / 2;
        }

        for (let i = 0; i < spawnCount; i++) {
            this.position_back++;
            for (let j = 0; j < this.cellNum; j++) {
                let item: cc.Node = this.getItem()
                this.addChild(item);
                this.items.push(item);
                let pos = this.position_back * this.cellNum + j
                if (pos >= this.totalCount) {
                    // item.opacity = 0;
                    this.setItemActive(item, false)
                } else {
                    if (this.scrollView.vertical) {
                        let posy = -(item.height + this.spaceY) * (0.5 + i)
                        let posx = letx + (item.width + this.spaceX) * j;
                        this.setItemPosition(item, posx, posy)
                    } else {
                        let posx = (item.width + this.spaceX) * (0.5 + i)
                        let posy = letx - (item.height + this.spaceY) * j;
                        this.setItemPosition(item, posx, posy)
                    }
                    this.delegate.emit([this, pos, item]);


                }

            }

        }
        let s = this.items.length / this.cellNum;
        s = this.items.length % this.cellNum == 0 ? s : s + 1;
        this.offset = this.itemSize * s;
        this.bufferZone = this.bufferSize / 2;
        if (this.initFinish) {
            this.initFinish.emit([this])
        }
    }

    protected setItemPosition(item: cc.Node, posx, posy) {
        item.setPosition(posx, posy);
    }

    protected setItemPositionX(item: cc.Node, x) {
        item.x = x
    }
    protected setItemPositionY(item: cc.Node, y) {
        item.y = y
    }

    // protected setItemOpacity(item: cc.Node, opacity) {
    //     item.opacity = opacity
    // }

    protected setItemActive(item: cc.Node, flag: boolean) {
        item.active = flag;
    }

    protected addChild(item) {
        if (!item.parent) {
            this.content.addChild(item);
        } else {
            this.setItemActive(item, true)
        }
    }

    protected getPositionInView(item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }



    protected updateItem() {
        let items = this.items;
        let isDown = false;
        if (this.scrollView.vertical) {
            isDown = this.scrollView.content.y < this.lastContentPos; //   
        } else {
            isDown = this.scrollView.content.x > this.lastContentPos; //
        }
        for (let i = 0; i < this.items.length; i += this.cellNum) {
            //把每一列或者每一行的第一个道具拿出来做比较
            if (items[i]) {
                let viewPos = this.getPositionInView(items[i]);
                // cc.log(' i =====  ', i)
                if (this.scrollView.vertical) {
                    if (isDown) {
                        if (viewPos.y < - this.bufferZone && items[i].y + this.offset < 0) {
                            this.position_front--;
                            this.position_back--;
                            for (let j = 0; j < this.cellNum; j++) {
                                let item: cc.Node = items[i + j]
                                if (item) {
                                    this.setItemPositionY(item, item.y + this.offset)
                                    let pos = this.position_front * this.cellNum + j;
                                    if (!item.active) {
                                        this.setItemActive(item, true)
                                    }
                                    this.delegate.emit([this, pos, item]);
                                }
                            }
                        }
                    } else {
                        if (viewPos.y > this.bufferZone && items[i].y - this.offset > -this.contentSize) {
                            this.position_front++;
                            this.position_back++;
                            for (let j = 0; j < this.cellNum; j++) {
                                const item = items[i + j];
                                if (item) {
                                    this.setItemPositionY(item, item.y - this.offset)
                                    let pos = this.position_back * this.cellNum + j
                                    if (pos >= this.totalCount) {
                                        this.setItemActive(item, false)
                                    } else {
                                        if (!item.active) {
                                            this.setItemActive(item, true)
                                        }
                                        this.delegate.emit([this, pos, item]);
                                    }

                                }

                            }

                        }
                    }
                } else {
                    if (isDown) {//向右滑动
                        if (viewPos.x > this.bufferZone && items[i].x - this.offset > 0) {
                            this.position_front--;
                            this.position_back--;
                            for (let j = 0; j < this.cellNum; j++) {
                                const item = items[i + j];
                                if (item) {
                                    if (!item.active) {
                                        this.setItemActive(item, true)
                                    }
                                    this.setItemPositionX(item, item.x - this.offset)
                                    this.delegate.emit([this, this.position_front * this.cellNum + j, item]);
                                }

                            }

                        }

                    } else {
                        if (viewPos.x < - this.bufferZone && items[i].x + this.offset < this.contentSize) {
                            this.position_front++;
                            this.position_back++;
                            for (let j = 0; j < this.cellNum; j++) {
                                const item = items[i + j];
                                if (item) {
                                    this.setItemPositionX(item, item.x + this.offset)
                                    let pos = this.position_back * this.cellNum + j
                                    if (pos >= this.totalCount) {
                                        this.setItemActive(item, false)
                                    } else {
                                        if (!item.active) {
                                            this.setItemActive(item, true)
                                        }
                                        this.delegate.emit([this, pos, item]);
                                    }

                                }
                            }

                        }
                    }
                }
            }

        }
        if (this.scrollView.vertical) {
            this.lastContentPos = this.scrollView.content.y;
        } else {
            this.lastContentPos = this.scrollView.content.x;
        }
    }

    /**
     * 移动到指定行或者列
     * 时间不能为 0
     * @param pos 从 0 开始 
     * @param time 
     */
    scrollToOffset(pos: number, time: number = 1): void {
        if (!this.scrollView) {
            return;
        }
        let offset = cc.v2()
        if (this.scrollView.vertical) {
            offset.y = pos * this.itemSize;
        } else {
            offset.x = pos * this.itemSize;
        }
        this.scrollView.scrollToOffset(offset, time)
    }


    /**
     * 移动到底部
     * 时间不能为 0
     * @param time 
     */
    scrollToBottom(time: number = 1) {
        if (!this.scrollView) {
            return;
        }
        this.scrollView.scrollToBottom(time)
    }

    /**
     * 移动到顶部
     * 时间不能为 0
     * @param time 
     */
    scrollToTop(time: number = 1) {
        if (!this.scrollView) {
            return;
        }
        this.scrollView.scrollToTop(time)
    }
    /**
     * 删除指定节点。
     * 更新此节点后的所有节点
     * 根据剩余节点的个数调整位置。
     * @param item 
     */
    remove(item: cc.Node) {

    }
}
