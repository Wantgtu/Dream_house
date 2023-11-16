import { EventDispatcher } from "../event";
import { DIR } from "../tools/Define";
import { PhysicalManager } from "./PhysicalManager";
import Utils from "../tools/Utils";
import { G, SCREEN_Y } from "./MoveConfig";
import { MoveObject } from "./MoveObject";
import MoveCollide from "./MoveCollide";

export default class MoveSystem extends EventDispatcher {



    protected collide: MoveCollide;
    b: MoveSystem[] = [];
    // protected collideFlag: boolean = false;
    //是否受重力影响
    g: boolean = true;

    //是否可见
    enable: boolean = true;

    //是否参与缩放
    scale: boolean = true;

    //是否更新位置
    updatePos: boolean = true;

    //速度
    // speed: Vector3 = new Vector3(0, 0, 0)

    protected speedX: number = 0;
    protected speedY: number = 0;
    protected speedZ: number = 0;

    //角色在地图中的位置
    // position: Vector3 = new Vector3(0, 0, 0)
    protected x: number = 0;
    protected y: number = 0;
    protected z: number = 0;

    //款到纵深
    protected width: number = 0
    protected height: number = 0;
    protected depth: number = 0;

    // 弹力

    elasticity: number = 0;
    //摩擦力
    frictional: number = 0;

    //跳跃高度
    jumpHigh: number = 350;

    //左右移动方向
    protected moveXDir: DIR = DIR.RIGHT;
    //上下移动方向
    protected moveZDir: DIR = DIR.UP;

    // isMoveObject: boolean = false;

    isPlane: boolean = false;

    protected maxY: number = -1;

    protected minY: number = -1;

    //作用对象，抽象平台的差异。
    private _node: MoveObject;
    protected onGroundFlag: boolean = true;
    constructor(obj: MoveObject) {
        super();
        this._node = obj;
    }
    get node() {
        return this._node
    }
    getLeft() {
        return this.x - this.node.getAnchorX() * this.width;
    }

    getRight() {
        return this.x + (1 - this.node.getAnchorX()) * this.width;
    }

    getMidY() {
        return this.y + SCREEN_Y * (this.node.getAnchorY() * this.height) / 2
    }

    getMidX() {
        return this.x + (1 - this.node.getAnchorX()) * this.width / 2;
    }

    getTop() {
        return this.y + SCREEN_Y * this.node.getAnchorY() * this.height;
    }

    getBottom() {
        return this.y - SCREEN_Y * (1 - this.node.getAnchorY()) * this.height;
    }


    setCollide(c: MoveCollide) {
        this.collide = c;
    }

    getCollide() {
        return this.collide;
    }

    // setCollideFlag(f: boolean) {
    //     this.collideFlag = f;
    // }

    // isCollide() {
    //     return this.collideFlag;
    // }



    onGround(func: Function, target: any) {
        this.on('onGround', func, target)
    }

    offGround(func: Function, target: any) {
        this.off('onGround', func, target)
    }

    emitGround() {
        this.emit('onGround', this.onGroundFlag)
    }

    isScale() {
        return this.scale;
    }

    isUpdatePos() {
        return this.updatePos
    }


    start() {
        if (this.enable) {
            this.setEnable(true)
        }

    }

    onDestroy() {
        if (this.enable) {
            this.setEnable(false)
        }
    }

    getDir(mv: MoveSystem) {
        let dh = this.height / 3;
        let dw = this.width / 3;
        if (Math.abs(mv.getTop() - this.getBottom()) <= dh) {
            return DIR.DOWN
        } else if (Math.abs(mv.getLeft() - this.getRight()) <= dw) {
            return DIR.RIGHT
        } else if (Math.abs(mv.getRight() - this.getLeft()) <= dw) {
            return DIR.LEFT
        } else if (Math.abs(mv.getBottom() - this.getTop()) <= dh) {
            return DIR.UP
        } else {
            return DIR.NONE;
        }

    }


    setEnable(f: boolean) {
        this.enable = f;
        //console.log('MoveSystem setEnable f ', f)
        if (this.enable) {

            if (this.isPlane) {
                PhysicalManager.instance().addPlane(this)
            } else {
                PhysicalManager.instance().add(this)
            }

        } else {

            if (this.isPlane) {
                PhysicalManager.instance().removePlane(this)
            } else {
                PhysicalManager.instance().remove(this)
            }

        }
    }

    isEnable() {
        return this.enable;
    }
    setMoveXDir(d: DIR) {
        this.moveXDir = d;
    }

    getMoveXDir() {
        return this.moveXDir;
    }

    setMoveZDir(d: DIR) {
        this.moveZDir = d;
    }

    getMoveZDir() {
        return this.moveZDir;
    }


    getFrictional() {
        return this.frictional;
    }

    setGrictional(n: number) {
        this.frictional = n;
    }

    setElasticity(n: number) {
        this.elasticity = n;
    }

    getElasticity() {
        return this.elasticity;
    }

    isG() {
        return this.g
    }

    setG(f: boolean) {
        this.g = f;
    }
    getJumpHigh() {
        return this.jumpHigh;
    }
    setJumpHight(h: number) {
        this.jumpHigh = h;
    }
    addJumpHigh(h: number) {
        this.jumpHigh += h;
    }

    jump(h: number) {
        this.jumpHigh = h;
        let spy = Utils.getVy(G, h);
        console.log(' jump spy ', spy)
        this.onGroundFlag = false;
        this.setSpeedY(spy)
    }


    // isJumping() {
    //     return this.position.y > 0
    // }
    setX(x: number) {
        this.x = x;
    }

    getMinY() {
        return this.minY;
    }

    getMaxY() {
        return this.maxY;
    }

    setY(y: number) {
        this.y = y;
        if (this.minY == -1) {
            this.minY = y;
        } else if (y < this.minY) {
            this.minY = y;
        }
        if (this.maxY == -1) {
            this.maxY = y;
        } else if (y > this.maxY) {
            this.maxY = y;
        }
    }

    getZ() {
        return this.z;
    }

    setZ(z: number) {
        this.z = z;
    }

    updateZIndex() {
        this.node.setZIndex(-this.getZ())
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }


    getSpeedX() {
        return this.speedX
    }

    setSpeedX(s: number) {
        this.speedX = s;
    }

    setSpeedY(spy: number) {
        this.speedY = spy;
    }

    getSpeedY() {
        return this.speedY
    }

    setSpeedZ(z: number) {
        this.speedZ = z;
    }

    getSpeedZ() {
        return this.speedZ;
    }

    isOnGround() {
        return this.onGroundFlag;
    }

    setOnGroundFlag(f: boolean) {
        this.onGroundFlag = f;
        this.emitGround()

    }

    setSpeed(x: number, y: number, z: number) {
        // console.log(' setSpeed ', x, y, z)
        this.setSpeedX(x)
        this.setSpeedY(y)
        this.setSpeedZ(z)
    }
    setPosition(x: number, y: number, z: number) {
        // console.log(' setPosition ', x, y, z)
        this.setX(x)
        this.setZ(z)
        let sy = y - z;
        if (sy < 0) {
            sy = 0
        }
        this.setY(sy)
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height
    }

    getDepth() {
        return this.depth;
    }

    setWidth(w: number) {
        this.width = w;
    }

    setHeight(h: number) {
        this.height = h;
    }
}