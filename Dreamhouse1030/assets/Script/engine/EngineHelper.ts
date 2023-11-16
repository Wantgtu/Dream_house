import { ModuleManager } from "../cfw/module";
import { ResItem, ResType } from "../cfw/res";
import Utils from "../cfw/tools/Utils";


export default class EngineHelper {
    static getMidPos() {
        let size = cc.view.getVisibleSize()
        return cc.v2(size.width / 2, size.height / 2)
    }

    static getGlobalPos(node: cc.Node) {
        return node.parent.convertToWorldSpaceAR(node.getPosition())
    }

    /**
 * 将self的坐标转换到target坐标系中
 * @param self 自身节点
 * @param target 转坐标系的节点
 */
    static convertToTarget(self: cc.Node, target: cc.Node) {
        if (!self || !self.parent) {
            return
        }
        let tpos = self.parent.convertToWorldSpaceAR(self.getPosition())
        tpos = target.convertToNodeSpaceAR(tpos)
        return tpos
    }
    /**
      * 必须在同一层级中 
      * 如果觉得getBoundingBox性能不够，可以自行根据节点的坐标和宽高进行判定。
      * @param other 
      * @param self 
      * @param func 
      */
    static collision(self: cc.Node, other: cc.Node): boolean {
        let rect1 = self.getBoundingBox()
        let rect2 = other.getBoundingBox();
        let flag = this.isRectCollideRect(rect1, rect2);
        return flag;
    }

    static isRectInRect(rect: cc.Rect, area: cc.Rect) {
        return rect.x >= area.x &&
            rect.x + rect.width <= area.x + area.width &&
            rect.y >= area.y &&
            rect.y + rect.height <= area.y + area.height;
    }

    static isRectCollideRect(r1: cc.Rect, r2: cc.Rect) {
        let flag = !(r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.x > r1.x + r1.width || r2.y + r2.height < r1.y);
        if (flag) {
        }
        return flag;
    }


    static isPointInRect2(point: cc.Node, rect: cc.Rect) {

        return point.x <= rect.x + rect.width && point.x >= rect.x && point.y <= rect.y + rect.height && point.y >= rect.y;
    }

    static isPointInRect(point: cc.Node, rx: number, ry: number, rw: number, rh: number): boolean {
        return point.x <= rx + rw && point.x >= rx && point.y <= ry + rh && point.y >= ry;
    }

    static isPositionInRect(point: cc.Vec2, rect: cc.Rect, des: string = '') {

        let flag1 = point.x <= rect.x + rect.width
        let flag2 = point.x >= rect.x;
        let flag3 = point.y <= rect.y + rect.height;
        let flag4 = point.y >= rect.y;

        if (des) {
            cc.log(' point ', point.x, point.y)
            cc.log(' rect ', rect.x, rect.y, rect.width, rect.height)
            cc.log(' des ===  ', des)
            cc.log('isPositionInRect', flag1, flag2, flag3, flag4)
        }
        return flag1 && flag2 && flag3 && flag4;
    }
    static isPositionInRectMid(point: cc.Vec2, rect: cc.Rect) {
        // cc.log(' point.x ', point.x, ' rect.x ', rect.x)
        let hw = rect.width / 2
        let hh = rect.height / 2
        let flag1 = point.x <= rect.x + hw
        let flag2 = point.x >= rect.x - hw;
        let flag3 = point.y <= rect.y + hh;
        let flag4 = point.y >= rect.y - hh;
        cc.log(flag1, flag2, flag3, flag4)
        return flag1 && flag2 && flag3 && flag4;
    }

    /**
 * 判断点是否在旋转后的矩形中
 * @param point 触摸点的坐标
 * @param node 碰撞节点，锚点必须为(0.5,0.5)
 */
    static isPosInRect(point: cc.Vec2, node: cc.Node, des: string = '') {
        let anx = node.anchorX
        let any = node.anchorY
        let w = node.width
        let h = node.height

        // let O = node.angle;
        let center = node.position;
        let x = point.x
        let y = point.y
        let flag1 = x <= center.x + (1 - anx) * w;
        let flag2 = x >= center.x - anx * w;
        let flag3 = y <= center.y + (1 - any) * h;
        let flag4 = y >= center.y - any * h;
        if (des) {
            cc.log(' point ', point.x, point.y)
            cc.log(' rect ', node.x, node.y, node.width, node.height)
            cc.log(' des ===  ', des)
            cc.log('isPositionInRect', flag1, flag2, flag3, flag4)
        }
        return flag1 && flag2 && flag3 && flag4;
    }

    /**
     * 判断点是否在旋转后的矩形中
     * @param point 触摸点的坐标
     * @param node 碰撞节点，锚点必须为(0.5,0.5)
     */
    static isPosInRotationRect(point: cc.Vec2, node: cc.Node) {
        let hw = node.width / 2;
        let hh = node.height / 2
        let O = node.angle;
        let center = node.position;
        let X = point.x
        let Y = point.y
        let r = -O * (Math.PI / 180)
        let nTempX = center.x + (X - center.x) * Math.cos(r) - (Y - center.y) * Math.sin(r);
        let nTempY = center.y + (X - center.x) * Math.sin(r) + (Y - center.y) * Math.cos(r);
        if (nTempX > center.x - hw && nTempX < center.x + hw && nTempY > center.y - hh && nTempY < center.y + hh) {
            return true;
        }
        return false
    }


    /**
      * 判断点是否在旋转后的矩形中
      * @param point 触摸点的坐标
      * @param node 碰撞节点，锚点必须为(0.5,0.5)
      */
    static isPosInWordRotationRect(point: cc.Vec2, node: cc.Node) {
        if (!node || !node.parent) {
            return false;
        }
        let hw = node.width / 2;
        let hh = node.height / 2
        let O = node.angle;
        let center = node.parent.convertToWorldSpaceAR(node.position);
        let X = point.x
        let Y = point.y
        let r = -O * (Math.PI / 180)
        let nTempX = center.x + (X - center.x) * Math.cos(r) - (Y - center.y) * Math.sin(r);
        let nTempY = center.y + (X - center.x) * Math.sin(r) + (Y - center.y) * Math.cos(r);
        // cc.log(' X ', X, 'Y ', Y, ' O ', O, ' nTempX ', nTempX, ' nTempY ', nTempY)
        if (nTempX > center.x - hw && nTempX < center.x + hw && nTempY > center.y - hh && nTempY < center.y + hh) {
            return true;
        }
        return false
    }

    static distance(p1: cc.Vec2, p2: cc.Vec2) {
        return Utils.distance(p1.x, p1.y, p2.x, p2.y)
    }

    static setSpriteFrame(sprite: cc.Sprite, icon: string, moduleID: string) {
        ModuleManager.loadRes(moduleID, icon, ResType.SpriteFrame,
            (err, item: ResItem) => {
                if (err || !cc.isValid(sprite.node)) {
                    return;
                }
                sprite.spriteFrame = item.getRes()
            })
    }

    static getRootPos(parent, root: cc.Node, flag: boolean = true) {
        let pos = cc.v2()
        // let parent = this.pos$VNode;
        while (parent != root) {
            pos.x += parent.x;
            pos.y += parent.y;
            parent = parent.parent;
        }
        if (flag) {
            pos.x += parent.x;
            pos.y += parent.y;
        }

        return pos;
    }
}