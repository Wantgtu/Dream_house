
import MoveLayer from "./MoveLayer";
import { ISize, Vector2 } from "../../engine/unity";
import { engine } from "../../engine/engine";
let ID = 0, X = 1, Y = 2;
function getDistance(x1: number, y1: number, x2: number, y2: number) {
    let dx: number = x1 - x2;
    let dy: number = y1 - y2;
    let distance: number = Math.sqrt(dx * dx + dy * dy);
    return distance;
}

export default class MoveMap {


    moveScale: number = 1;

    initScale: number = 1;

    //地图的z真实宽高
    protected worldRect_: ISize = new ISize(0, 0)
    //摄像机的位置
    protected cameraPoint_: Vector2 = new Vector2()
    //摄像机宽高
    protected cameraRect_: ISize = new ISize(0, 0)

    protected minScale: number = 1;
    //最大缩放数
    protected maxScale: number = 2;
    //摄像机移动速度
    protected cameraScaleSpeed_: number = 0.02;

    protected cameraLayerScale_: number = 1;

    //两点间的距离
    protected distance: number = 0;

    protected bgLayer: MoveLayer = null;

    protected touchPoints: number[][] = []

    start(layer: MoveLayer) {

        this.cameraLayerScale_ = this.initScale;
        this.bgLayer = layer
        this.bgLayer.setAnchorPoint(0, 0)
        let vs = engine.getVisibleSize()
        this.distance = 0
        this.cameraScaleSpeed_ = 0.02
        this.worldRect_ = new ISize(this.bgLayer.getWidth(), this.bgLayer.getHeight())
        this.cameraRect_ = new ISize(vs.width, vs.height)
        this.minScale = this.cameraRect_.width / this.worldRect_.width
        this.minScale = Math.max(this.minScale, this.cameraRect_.height / this.worldRect_.height)
        if (this.cameraLayerScale_ < this.minScale) {
            this.cameraLayerScale_ = this.minScale;
        }
        this.bgLayer.setScale(this.cameraLayerScale_)
        let ix = (this.cameraRect_.width - this.worldRect_.width * this.cameraLayerScale_) / 2
        let iy = (this.cameraRect_.height - this.worldRect_.height * this.cameraLayerScale_) / 2
        iy = 0
        this.cameraPoint_ = new Vector2(ix, iy)

        this.bgLayer.setPosition(this.cameraPoint_)
    }

    isFull() {
        return this.touchPoints.length >= 2;
    }

    count() {
        return this.touchPoints.length;
    }

    setBgLayer() {

    }

    updateMultiPoint(x: number, y: number, id: number) {
        for (let index = 0; index < this.touchPoints.length; index++) {
            const table: number[] = this.touchPoints[index];
            if (table[ID] == id) {
                table[X] = Math.floor(x)
                table[Y] = Math.floor(y)
            }
        }
    }

    setMultiPointDistance() {
        if (this.touchPoints.length == 2) {

            let firstValue: number[] = this.touchPoints[0]
            let firstPoint = new Vector2(firstValue[X], firstValue[Y])
            let secondValue: number[] = this.touchPoints[1]
            let secondPoint = new Vector2(secondValue[X], secondValue[Y])
            let tempDistance = this.distance
            this.distance = getDistance(firstValue[X], firstValue[Y], secondValue[X], secondValue[Y])
            let abs = Math.abs(this.distance - tempDistance)
            if (abs <= 10) {//避免人手的抖动
                return;
            }
            if (tempDistance != 0) {
                // console.log('  tempDistance ', tempDistance, 'this.distance', this.distance)
                let oldScale = this.cameraLayerScale_;
                let oldWidth = this.worldRect_.width * this.cameraLayerScale_
                let oldHeight = this.worldRect_.height * this.cameraLayerScale_
                if (tempDistance > this.distance) {
                    this.cameraLayerScale_ -= this.cameraScaleSpeed_;
                    this.cameraLayerScale_ = (this.cameraLayerScale_ < this.minScale) ? this.minScale : this.cameraLayerScale_;
                } else if (tempDistance < this.distance) {
                    this.cameraLayerScale_ += this.cameraScaleSpeed_;
                    this.cameraLayerScale_ = (this.cameraLayerScale_ > this.maxScale) ? this.maxScale : this.cameraLayerScale_;
                }

                if (this.cameraLayerScale_ == oldScale) {
                    return;
                }
                let newWidth = this.worldRect_.width * this.cameraLayerScale_
                let newHeight = this.worldRect_.height * this.cameraLayerScale_
                let disWidth = newWidth - oldWidth
                let disHeight = newHeight - oldHeight

                this.bgLayer.setScale(this.cameraLayerScale_);
                let p1 = this.getWorldPos(firstPoint)
                let p2 = this.getWorldPos(secondPoint)
                let midPoint = null;
                if (p1.x > p2.x) {
                    midPoint = this.getMidPoint(p2, p1)
                } else {
                    midPoint = this.getMidPoint(p1, p2)
                }
                let scalex = midPoint.x / this.worldRect_.width
                let scaley = midPoint.y / this.worldRect_.height
                let oldPos = this.bgLayer.getPosition()
                oldPos.x -= disWidth * scalex;
                oldPos.y -= disHeight * scaley
                this.bgLayer.setPosition(this.setCameraMoveRange(oldPos))
            }
        }
    }

    getWorldPoint(layer: MoveLayer, point: Vector2) {
        point = layer.convertToNodeSpaceAR(point)
        return point
    }

    getMidPoint(p1: Vector2, p2: Vector2) {
        let disx = p2.x - p1.x
        let disy = p2.y - p1.y
        let x = (p1.x + disx / 2)
        let y = p1.y + disy / 2
        return new Vector2(x, y)
    }


    setCameraMoveRange(newPos: Vector2) {
        let scale = this.cameraLayerScale_
        let cameraRange_left = 0
        let cameraRange_right = -(this.worldRect_.width * scale - this.cameraRect_.width - cameraRange_left);

        let cameraRange_down = 0
        let cameraRange_up = -(this.worldRect_.height * scale - this.cameraRect_.height - cameraRange_down);
        newPos.x = Math.min(cameraRange_left, newPos.x);
        newPos.x = Math.max(cameraRange_right, newPos.x);
        newPos.y = Math.min(cameraRange_down, newPos.y);
        newPos.y = Math.max(cameraRange_up, newPos.y);
        return newPos;
    }

    setCameraMove(distance: Vector2) {
        let currentPoint = this.bgLayer.getPosition()
        Vector2.add(currentPoint, currentPoint, distance)
        let point = this.setCameraMoveRange(currentPoint)
        this.bgLayer.setPosition(point);
    }

    onTouchBegan(point: Vector2, id: number) {
        let len = this.touchPoints.length

        if (len > 2) {
            return
        }
        this.touchPoints.push([id, point.x, point.y])
    }

    moveDouble(pos: Vector2, id: number) {
        let len = this.touchPoints.length
        if (len > 2) {
            return
        }
        let x = pos.x, y = pos.y;
        this.updateMultiPoint(x, y, id)
        this.setMultiPointDistance()
    }

    getWorldPos(pos: Vector2) {
        return this.bgLayer.convertToNodeSpaceAR(pos)
    }

    moveSingle(pos: Vector2, id: number, delta: Vector2) {
        let len = this.touchPoints.length
        if (len == 1) {
            let table = this.touchPoints[0]
            if (table[ID] == id) {
                // let delta = e.getDelta();
                delta.x *= this.moveScale
                delta.y *= this.moveScale
                this.setCameraMove(delta)
                this.updateMultiPoint(pos.x, pos.y, id)
            }
        }
    }

    onTouchEnd(pos: Vector2, id: number) {
        let len = this.touchPoints.length
        if (len == 1) {
            let table = this.touchPoints[0]
            if (table[ID] == id) {

            }
        } else if (len == 2) {
            this.distance = 0

        }
        this.removeTouchPoint(id)
    }

    removeTouchPoint(id: number) {
        for (let index = 0; index < this.touchPoints.length; index++) {
            const element = this.touchPoints[index];
            if (id == element[ID]) {
                this.touchPoints.splice(index, 1)
                break;
            }
        }

    }

    onTouchCancelled(param: any) {
        this.touchPoints.length = 0;
        this.distance = 0
    }
}
