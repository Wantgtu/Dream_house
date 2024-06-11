/**
 * 地图管理器
 * 支持一张文章的地图根据等级不同开启不同范围
 */
export default class GameMap {
    //完整地图的宽度 
    protected mapWidth: number = 0;
    //完整地图的高度
    protected mapHeight: number = 0;

    //完整地图的纵深
    protected mapDepth: number = 0;

    //开放的范围宽度
    protected rangeWidth: number = 0;
    //开放的范围高度
    protected rangeHeight: number = 0;
    //开放的范围深度
    protected rangeDepth: number = 0;

    //摄像机可到达的最左侧坐标
    protected rangeX: number = 0;
    //摄像机可到达的最底部坐标
    protected rangeY: number = 0;
    //摄像机可到达的最外侧坐标
    protected rangeZ: number = 0;

    protected top: number = 0;

    protected right: number = 0;

    protected anchorX: number = 0;

    protected anchorY: number = 0;


    setAnchor(x: number, y: number) {
        this.anchorX = x;
        this.anchorY = y;
    }

    getAnchorX() {
        return this.anchorX;
    }

    getAnchorY() {
        return this.anchorY;
    }


    init(w: number, h: number, r: number = 0) {
        console.log(' GameMap w ', w, ' h ', h, ' r ', r)
        if (this.mapWidth != w || this.mapHeight != h || this.mapDepth != r) {
            this.mapWidth = w;
            this.mapHeight = h;
            this.setMapDepth(r)
            this.setRangeWidth(this.mapWidth)
            this.setRangeHeight(this.mapHeight)
            this.setRangeDepth(this.mapDepth)
        }


    }



    setMapWidth(w: number) {
        this.mapWidth = w;
    }

    setMapDepth(d: number) {
        this.mapDepth = d;
        this.updateTop();
    }


    /**
 * 是否在地图内
 * @param x 
 * @param y 
 */
    isInMap(x: number, y: number) {
        return x >= 0 && x <= this.getRangeWidth() && y >= 0 && y <= this.getRangeHeight();
    }


    getMapWidth() {
        return this.mapWidth
    }

    getMapHeight() {
        return this.mapHeight
    }

    getMapDepth() {
        return this.mapDepth;
    }

    getTop() {
        return this.top;
    }

    getRight() {
        return this.right;
    }

    setRangeX(x: number) {
        this.rangeX = x;
        this.updateRight()
    }

    getRangeX() {
        return this.rangeX;
    }

    setRangeY(y: number) {
        this.rangeY = y;
    }

    getRangeY() {
        return this.rangeY
    }

    setRangeZ(z: number) {
        this.rangeZ = z;
        this.updateTop();
    }

    updateTop() {
        this.top = this.rangeZ + this.mapDepth;
    }

    updateRight() {
        this.right = this.rangeX + this.getRangeWidth()
    }

    getRangeZ() {
        return this.rangeZ;
    }

    setRangeWidth(w: number) {
        this.rangeWidth = w;
        this.updateRight()
    }

    getRangeRight(width: number) {
        return this.rangeX + this.getRangeWidth() - width
    }

    setRangeDepth(r: number) {
        this.rangeDepth = r;
    }

    getRangeDepth() {
        return this.rangeDepth;
    }

    getRangeTop(height: number) {
        return this.rangeY + this.getRangeHeight() - height
    }


    getRangeWidth() {
        return this.rangeWidth
    }

    setRangeHeight(h: number) {
        this.rangeHeight = h;
    }

    getRangeHeight() {
        return this.rangeHeight
    }



}