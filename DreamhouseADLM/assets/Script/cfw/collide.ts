import { IRect } from "../engine/unity";


export function isRectCollideRect(r1: IRect, r2: IRect) {
    let flag = !(r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.x > r1.x + r1.width || r2.y + r2.height < r1.y);
    if (flag) {
    }
    return flag;
}

export function isRectInRect(rect: IRect, area: IRect) {
    return rect.x >= area.x &&
        rect.x + rect.width <= area.x + area.width &&
        rect.y >= area.y &&
        rect.y + rect.height <= area.y + area.height;
}

export interface PoolAble {

    //回收
    kill(): void;
    // 是否可以被回收
    canKill(): boolean;
    //是否可见或者离开屏幕
    isVisible(): boolean;

}

export class Bound extends IRect {


    private cx: number = 0;

    private cy: number = 0;


    private quadrantList: IRect[] = []
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height)
        this.cx = this.x + this.width / 2;
        this.cy = this.y + this.height / 2;
        let hw = this.width / 2;
        let hh = this.height / 2;
        this.quadrantList[0] = new IRect(this.cx, this.cy, hw, hh);
        this.quadrantList[1] = new IRect(this.x, this.cy, hw, hh);
        this.quadrantList[2] = new IRect(this.x, this.y, hw, hh);
        this.quadrantList[3] = new IRect(this.cx, this.y, hw, hh);

    }

    getQuadrantList(): IRect[] {
        return this.quadrantList;
    }
    /**
     * 与哪个象限相交
     * @param rect 
     * @param who 
     */
    isCollide(rect: IRect, who: number) {
        if (isRectCollideRect(rect, this.quadrantList[who])) {
            return who;
        }
        return -1;
    }

    /**
     * 是否在区域内
     * @param rect 
     * @param bounds 
     */
    isInBound(rect: IRect) {
        return isRectInRect(rect, this)
    }

    /**
     * 获得象限的索引 如果是-1 代表跨象限或者离开屏幕。
     * @param rect 
     */
    getIndex(rect: IRect): number {
        for (let index = 0; index < this.quadrantList.length; index++) {
            const element = this.quadrantList[index];
            if (isRectInRect(rect, element)) {
                return index;
            }
        }
        return -1;
    }

}
export interface CollideAble extends PoolAble {

    //对象是否还存在 ，按理说播完死亡动画后就不存在了。
    isAlive(): boolean;
    //获得对象的矩形区域
    getRect(): IRect;
    //更新对象
    updateObj(dt: number): void;

    //获得对象的索引
    getQuadIndex(): number;
    //设置对象索引
    setQuadIndex(index: number): void;




}




/*
 四叉树节点包含： 
- objects: 用于存储物体对象 
- nodes: 存储四个子节点
 - level: 该节点的深度，根节点的默认深度为0 
- bounds: 该节点对应的象限在屏幕上的范围，bounds是一个矩形
*/
export class QuadTree<T extends CollideAble> {

    private objects: T[] = null;
    private nodes: QuadTree<T>[] = null;
    private level: number = 0;
    private bounds: Bound;
    private MAX_OBJECTS: number = 0;
    private MAX_LEVELS: number = 0;

    // private  result: T[] = [];
    constructor(bounds: Bound, level = 0) {
        this.objects = []
        this.level = level
        this.bounds = bounds
        this.MAX_OBJECTS = 10
        this.MAX_LEVELS = 5
        this.nodes = []
    }

    clear() {
        var objs = this.objects;
        for (let i = objs.length - 1; i >= 0; i--) {
            if (objs[i].canKill()) {
                objs.splice(i, 1)[0].kill()
            }
        }
        let len = this.nodes.length
        for (let i = 0; i < len; i++) {
            this.nodes[i].clear();
        }
    }



    /**
     * 插入功能：
    如果当前节点[ 存在 ]子节点，则检查物体到底属于哪个子节点，如果能匹配到子节点，则将该物体插入到该子节点中
    如果当前节点[ 不存在 ]子节点，将该物体存储在当前节点。随后，检查当前节点的存储数量，如果超过了最大存储数量，
    则对当前节点进行划分，划分完成后，将当前节点存储的物体重新分配到四个子节点中。
     * @param rect 
     */
    insert(obj: T) {
        let rect = obj.getRect();
        let objs = this.objects
        let index = -1;

        if (this.nodes.length > 0) {
            index = this.bounds.getIndex(rect)
            // console.log('insert ' + " 属于 第 " + index + " 象限")
            if (index !== -1) {
                obj.setQuadIndex(index)
                this.nodes[index].insert(obj)
                return
            }
        }
        // console.log('insert rect' + rect, index)
        obj.setQuadIndex(index)
        objs.push(obj)
        // console.log('insert this.objects.length' + this.objects.length, this.MAX_OBJECTS)
        if (!this.nodes.length &&
            this.objects.length > this.MAX_OBJECTS &&
            this.level < this.MAX_LEVELS) {

            this.split()

            for (let i = objs.length - 1; i >= 0; i--) {
                obj = objs[i];
                index = this.bounds.getIndex(obj.getRect())
                // cc.log('insert 数量达到上限  '+objs[i].node.name+" 属于 第 "+index+" 象限")
                if (index !== -1) {
                    obj.setQuadIndex(index)
                    this.nodes[index].insert(objs.splice(i, 1)[0])
                }
            }
        }
    }

    //生成子象限
    split() {
        let level = this.level
        let quadList: IRect[] = this.bounds.getQuadrantList();
        for (let index = 0; index < quadList.length; index++) {
            const element = quadList[index];
            this.nodes.push(new QuadTree(new Bound(element.x, element.y, element.width, element.height), level + 1));
        }
    }

    /**
     * 检索功能：
    给出一个物体对象，该函数负责将该物体可能发生碰撞的所有物体选取出来。
    该函数先查找物体所属的象限，
    该象限下的物体都是有可能发生碰撞的，
    然后再递归地查找子象限
     * @param rect 
     */
    retrieve(obj: T, step: number, result: T[]): void {
        // this.result.length = 0;
        // let i = 0;
        step++;
        // cc.log(' step ========================  ',step)
        if (step > 10) {
            return;
        }
        // console.log('retrieve this.nodes.length ', this.nodes.length)
        if (this.nodes.length) {
            let rect: IRect = obj.getRect();
            // console.log('retrieve rect ', rect)
            let index = this.bounds.getIndex(rect);
            // console.log('retrieve ' + " 属于 第 " + index + " 象限")
            if (index !== -1) {
                this.nodes[index].retrieve(obj, step, result)
            } else {
                // 切割矩形

                for (let i = 0; i < 4; i++) {
                    let idx = this.bounds.isCollide(rect, i)
                    if (idx != -1) {
                        this.nodes[idx].retrieve(obj, step, result);
                    }

                }
            }
        }

        // let list = this.objects
        let count = this.objects.length;
        for (let index = 0; index < count; index++) {
            const element = this.objects[index];
            if (element.isAlive()) {
                result.push(element)
            }
        }
    }




    updateState(dt: number) {
        // let count = this.objects.length;
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i]) {
                this.objects[i].updateObj(dt);
            } else {
                console.warn(' QuadTree Error  updateObj obj is null ', i, this.objects.length)
            }
        }
        let len = this.nodes.length
        for (let i = 0; i < len; i++) {
            this.nodes[i].updateState(dt);
        }
    }

    /**
     * 从根节点深入四叉树，检查四叉树各个节点存储的物体是否依旧属于该节点（象限）的范围之内，如果不属于，则重新插入该物体。
     * @param root 
     */
    checkVisible(root?: QuadTree<T>) {
        root = root || this;

        //1. 遍历自己管理的对象。
        for (let i = this.objects.length - 1; i >= 0; i--) {
            if (!this.objects[i]) {
                console.log(' objs[i] is null  index is  ', i, ' count ' + this.objects.length)
                continue;
            }
            //2. 如果对象已经死亡或者隐藏 进行回收。
            if (!this.objects[i].isVisible()) {
                // cc.log(' 已经死亡 === ',this.objects[i])
                this.objects.splice(i, 1)[0].kill()
            } else {

                let rect: IRect = this.objects[i].getRect();
                //3. 判断对象的矩形区域是否还在当前象限内
                if (!this.bounds.isInBound(rect)) {
                    //4. 不在当前象限的时候 如果this 不是根节点 就插入根节点。后期重新安排。
                    if (this !== root) {
                        root.insert(this.objects.splice(i, 1)[0])
                    } else {
                        //
                        let flag = this.objects[i].isVisible();
                        if (!flag) {
                            // cc.log(' 已经死亡 === ',this.objects[i])
                            this.objects.splice(i, 1)[0].kill()
                            // }
                        }
                    }
                } else {
                    //获得对象在我管理的哪个象限内
                    let index = this.bounds.getIndex(rect)
                    //老象限
                    let lastIndex = this.objects[i].getQuadIndex()
                    //如果不是一个象限
                    if (lastIndex != index) {
                        // cc.log(' 象限有变化  lastIndex ',lastIndex,' newIndex ',index)
                        // cc.log('refresh '+objs[i].node.name+" 属于 第 "+index+" 象限")
                        if (index === -1) {
                            //如果是根点的话说明对象已经离开屏幕，就不用处理了。

                            if (this !== root) {
                                //如果不是根节点放回到根节点。
                                root.insert(this.objects.splice(i, 1)[0])
                            } else {
                                //设置新的象限
                                this.objects[i].setQuadIndex(index)

                            }
                        } else if (this.nodes.length > 0) {
                            // 如果象限没有变化就不需要执行插入操作。

                            this.nodes[index].insert(this.objects.splice(i, 1)[0])

                            // } else {

                            // }

                        } else {
                            this.objects[i].setQuadIndex(index)
                        }
                    } else {
                        // cc.log(' 象限没有变化  还是 ', lastIndex)
                    }

                }

            }
        }

        // 递归刷新子象限
        let len = this.nodes.length
        for (let i = 0; i < len; i++) {
            this.nodes[i].checkVisible(root);
        }

    }
}