import Utils from "../tools/Utils";
import MoveSystem from "./MoveSystem";
import GameMap from "./GameMap";
import { SCREEN_Y, SCREEN_X } from "./MoveConfig";

export default class MoveCamera {

    private OFFSET: number[] = [-5, 5, 4, -4]

    private x: number = 0;

    private y: number = 0;

    private z: number = 0;

    private ox: number = 0
    private oy: number = 0
    private oz: number = 0;
    //摄像机的宽度
    private width: number = 0;
    //摄像机的高度
    private height: number = 0;
    //摄像机纵深暂时无用
    private depth: number = 0;

    private hmw: number = 0;
    private hmh: number = 0;

    //屏幕纵向滚动的临界值
    protected percentH: number = 0;
    //屏幕横向滚动的临界值
    protected percentW: number = 0;

    protected map: GameMap;

    protected isCheck: boolean = false;

    protected scale: number = 1;


    setMap(m: GameMap) {
        this.map = m;
    }

    setPercentW(w: number) {
        this.percentW = w;
    }
    setPercentH(h: number) {
        this.percentH = h;
    }

    init(w: number, h: number, r: number = 0) {
        console.log(' MoveCamera w ', w, ' h ', h, ' r ', r)
        this.width = w;
        this.height = h;
        this.depth = r;
        // this.mapDepth = r;
        this.hmw = this.width / 2;
        this.hmh = this.height / 2;
        this.x = 0;
        this.y = 0;
        this.setZ(0)
        this.percentW = this.hmw;
        this.percentH = this.height / 3 * 1;
    }

    getPercentH() {
        return this.percentH;
    }
    getHMW() {
        return this.hmw;
    }

    getHMH() {
        return this.hmh;
    }

    getTail() {
        return this.x + this.width;
    }

    /**
     * 给定目标位置移动
     * @param tx 
     * @param ty 
     * @param map 
     * @param shakeTime 
     */
    scroll(tx: number, ty: number, shakeTime: number = 0) {

        let sx = this.x;
        let sy = this.y + this.height;
        let disx = tx - sx;
        let disz = sy - ty;

        let dish = (this.percentH - disz)
        let disw = disx - this.percentW
        // console.log('tx  ', tx, ' ty ', ty, ' sx ', sx, ' sy ', sy, ' disx ', disx, ' disy ', disz, ' dish ', dish, ' disw ', disw)
        this.move(disw, dish, shakeTime != 0);

    }

    checkBound(sx: number, sy: number, isShake: boolean = false) {
        let mw = this.map.getMapWidth();
        let mh = this.map.getMapHeight()
        let rw = mw - mw * this.getScale()
        let rh = mh - mh * this.getScale();
        let hw = rw / 2
        let map = this.map;
        let rangeX = map.getRangeX();
        if (sx < rangeX) {
            // console.log('  sx <= rangeX ')
            sx = rangeX;
        }
        let rangeY = map.getRangeY()
        if (sy < rangeY) {
            // console.log('  sy <= rangeY ')
            sy = rangeY;
        }
        let right = rangeX + mw - this.width - rw;
        if (sx > right) {
            // console.log('  sx >=  right ', right)
            sx = right;
        }
        let top = rangeY + mh - this.height - rh;
        if (sy > top) {
            // console.log('  sy >=  top ', top)
            sy = top;
        }
        if (isShake) {
            // this.bakcup();
            // console.log(' isShake ', isShake)
            this.ox = sx;
            this.oy = sy;
            sx = this.ox + this.OFFSET[Utils.random(this.OFFSET.length)];
            sy = this.oy + this.OFFSET[Utils.random(this.OFFSET.length)];
        }
        this.setX(sx);
        this.setY(sy);
    }

    /**
     * 给定速度移动
     * @param spdx 
     * @param spdy 
     * @param map 
     * @param isShake 
     */
    move(spdx: number, spdy: number, isShake: boolean = false) {
        let sx = this.getX(), sy = this.getY();

        sx += spdx;
        sy += spdy;
        // console.log(' move spdx ', spdx, ' spdy', spdy, ' sx ', sx, ' sy ', sy)
        this.checkBound(sx, sy, isShake)

    }




    public getWidth() {
        return this.width;
    }
    public getHeight() {
        return this.height;
    }

    public getX() {
        return this.x
    }
    public getY() {
        return this.y
    }
    public getZ() {
        return this.z;
    }
    public setX(x: number) {
        this.x = x;
    }
    public setY(y: number) {
        this.y = y;
    }
    public setZ(z: number) {
        this.z = z;
        this.scale = 1 + this.z;
    }


    getScale() {
        return this.scale;
    }

    adjustPosition(npc: MoveSystem) {
        let cx = this.getX()
        let cy = this.getY()
        let dis = npc.getY() + npc.getZ();
        // let height = this.map.getMapHeight();
        if (npc.isUpdatePos()) {
            npc.node.setX(npc.getX() - cx)
            npc.node.setY(dis - cy)
        } else {
            npc.node.setX(npc.getX())
            npc.node.setY(dis)
        }

        if (npc.isScale()) {
            npc.node.setScale(this.getScale());
        }

        if (this.isCheck) {
            let mx = npc.getX();
            let my = npc.getY()
            let w = npc.node.getWidth()
            let h = npc.node.getHeight()
            if (this.isInCamera(mx, my, w, h)) {
                if (!npc.node.isVisible()) {
                    npc.node.setVisible(true)
                }
            } else {
                if (npc.node.isVisible()) {
                    npc.node.setVisible(false)
                }
            }
        }

    }

    isInCamera(x: number, y: number, w: number, h: number, anx: number = 0.5, any: number = 0) {
        let cx = this.getX()
        let cy = this.getY()
        // let w = npc.node.getWidth();
        // let an = npc.node.getAnchorX();
        // let x = npc.getX()
        let lx = x - w * anx
        if (Utils.isRectCollideRect2(lx, w, cx, this.width)) {
            return true;
        } else {

            return false
        }
    }

    updateCameraZ(num: number) {
        let z = this.getZ()
        let s = this.scale + num;
        if (this.map.getMapWidth() * s <= this.getWidth()) {
            return;
        }
        if (this.map.getMapHeight() * s <= this.getHeight()) {
            return;
        }
        z += num;
        this.setZ(z)
        this.checkBound(this.getX(), this.getY())
    }

}