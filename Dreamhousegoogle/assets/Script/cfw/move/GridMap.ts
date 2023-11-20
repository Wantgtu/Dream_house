import GameMap from "./GameMap";
import { DIR } from "../tools/Define";
import { Vector2 } from "../../engine/unity";

export default class GridMap extends GameMap {
    //每个格子的宽度
    protected gridWidth: number = 0;

    protected gridHeight: number = 0;

    //横向格子的数量
    protected hGridNum: number = 0;
    //纵向格子的数量
    protected vGridNum: number = 0;

    //初始位置的坐标
    protected initX: number = 0;
    protected initY: number = 0;

    //竖棍与横棍的横向距离。
    protected vStickHStickXDis = 215;
    //竖棍与横棍的纵向距离。
    protected vStickHStickYDis = 175;
    //初始点横向索引
    protected initHIndex: number = 0
    //初始点纵向索引
    protected initVIndex: number = 0;

    initGrid(x: number, y: number, gridWidth: number, gridHeight: number) {
        this.setGridWidth(gridWidth)
        this.setGridHeight(gridHeight)
        this.setInitXY(x, y)
    }

    getVStickPosByID(id: number) {
        let index = this.getStickIndex(id)
        return this.getVStickPosByPos(index.x, index.y)
    }

    getVStickPosByPos(hindex: number, vindex: number) {
        // cc.log('getVStickPosByPos  hindex ', hindex, ' vindex ', vindex)

        let ix = this.getVHPos(hindex)
        let iy = this.getVVPos(vindex)
        return new Vector2(ix, iy)
    }

    getVHPos(hindex: number) {
        let dish = hindex - this.initHIndex;
        let ix = this.initX + dish * this.getGridWidth() - this.vStickHStickXDis
        return ix;
    }

    getVVPos(vindex: number) {
        let disv = vindex - this.initVIndex;

        let iy = this.initY + disv * this.getGridHeight() + this.vStickHStickYDis
        return iy;
    }

    getHStickPosByID(id: number) {
        let index = this.getStickIndex(id)
        return this.getHStickPosByPos(index.x, index.y)
    }

    getHStickPosByPos(hindex: number, vindex: number) {
        // cc.log('getHStickPosByPos  hindex ', hindex, ' vindex ', vindex)
        let ix = this.getHHPos(hindex)
        let iy = this.getHVPos(vindex)
        return new Vector2(ix, iy)
    }

    getHHPos(hindex: number) {
        let dish = hindex - this.initHIndex;
        let ix = this.initX + dish * this.getGridWidth()
        return ix;
    }

    getHVPos(vindex: number) {
        let disv = vindex - this.initVIndex;
        let iy = this.initY + disv * this.getGridHeight()
        return iy;
    }

    setInitXY(x: number, y: number) {
        this.initX = x;
        this.initY = y;
        this.initHIndex = this.getHIndex(this.initX)
        this.initVIndex = this.getVIndex(this.initY)

    }

    getHIndex(x: number) {
        return Math.floor(x / this.gridWidth)
    }

    getVIndex(y: number) {
        return Math.floor(y / this.gridHeight)
    }

    getInitID() {
        return this.getIDByIndex(this.initHIndex, this.initVIndex)
    }


    setGridWidth(w: number) {
        this.gridWidth = w;
        this.hGridNum = Math.floor(this.mapWidth / this.gridWidth)
    }

    getGridWidth() {
        return this.gridWidth;
    }

    getGridHeight() {
        return this.gridHeight;
    }

    getHGridNum() {
        return this.hGridNum;
    }

    getVGridNum() {
        return this.vGridNum;
    }

    setGridHeight(h: number) {
        this.gridHeight = h;
        this.vGridNum = Math.floor(this.mapHeight / this.gridHeight)
    }

    getStickID(hindex: number, vindex: number) {
        if (this.isHEdge(hindex)) {
            return -1;
        }
        if (this.isVEdge(vindex)) {
            return -1;
        }
        let id = hindex + this.hGridNum * vindex;
        return id;
    }

    getStickIndex(id: number) {
        let vIndex = Math.floor(id / this.hGridNum)
        let hIndex = id % this.hGridNum;
        return new Vector2(hIndex, vIndex)
    }

    getIndexByPos(pos: Vector2) {
        let hindex = Math.floor(pos.x / this.gridWidth)
        let vindex = Math.floor(pos.y / this.gridHeight)
        return new Vector2(hindex, vindex)
    }


    getIDByXY(x: number, y: number) {
        let hindex = Math.floor(x / this.gridWidth)
        if (this.isHEdge(hindex)) {
            return -1;
        }
        let vindex = Math.floor(y / this.gridHeight)
        if (this.isVEdge(vindex)) {
            return -1;
        }
        let id = this.getIDByIndex(hindex, vindex)
        return id;
    }

    getIDByPos(pos: Vector2) {
        let x = pos.x;
        let y = pos.y
        return this.getIDByXY(x, y)
    }

    isHEdge(index: number) {
        return index > this.hGridNum - 1 || index < 0;
    }
    isVEdge(index: number) {
        return index > this.vGridNum - 1 || index < 0;
    }
    getIDByIndex(hindex: number, vindex: number) {

        if (this.isHEdge(hindex)) {
            return -1;
        }
        if (this.isVEdge(vindex)) {
            return -1;
        }
        let id = this.getStickID(hindex, vindex)
        return id;
    }

    getDirID(dir: DIR, hIndex: number, vIndex: number) {
        switch (dir) {
            case DIR.LEFT:
                hIndex--;
                break;
            case DIR.RIGHT:
                hIndex++;
                break;
            case DIR.UP:
                vIndex++
                break;
            case DIR.DOWN:
                vIndex--;
                break;
        }
        return this.getIDByIndex(hIndex, vIndex)

    }

}