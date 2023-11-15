import { DIR } from "./tools/Define";
import { MapList } from "./struct";
import GridMap from "./move/GridMap";

export interface PathInterface {


    getMap(): GridMap;
    getDirID(dir: DIR, index: { x: number, y: number }): number;
    canMove(dir: DIR, index: { x: number, y: number }): boolean;
}

/**
 * doc  https://www.cnblogs.com/iwiniwin/p/10793654.html
 * auth cgw 20210301
 */
export class PathHelper {

    //方向数量
    protected _dirNum: number = 8;

    //地图
    protected map: GridMap;

    //代理
    protected delegator: PathInterface;


    init(s: PathInterface, dirNum: number = 4) {
        this.delegator = s;
        this._dirNum = dirNum;
        this.map = this.delegator.getMap()
    }

    has(id: number, list: MapNode[]) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.mapID == id) {
                return index;
            }
        }
        return -1;
    }

    getCost(startID: number, endID: number) {
        let index1 = this.map.getStickIndex(startID)
        let index2 = this.map.getStickIndex(endID)
        return Math.abs(index1.x - index2.x) + Math.abs(index1.y - index2.y)
    }


    updateF(startNode: MapNode, endMapID: number, parent: MapNode = null) {
        if (parent) {
            startNode.g = parent.g + this.getCost(startNode.mapID, parent.mapID)
        }
        startNode.h = this.getCost(startNode.mapID, endMapID)
    }

    /**
    将初始节点放入到open列表中。
    判断open列表。如果为空，则搜索失败。如果open列表中存在目标节点，则搜索成功。
    从open列表中取出F值最小的节点作为当前节点，并将其加入到close列表中。
    计算当前节点的相邻的所有可到达节点，生成一组子节点。对于每一个子节点：
    如果该节点在close列表中，则丢弃它
    如果该节点在open列表中，则检查其通过当前节点计算得到的F值是否更小，如果更小则更新其F值，并将其父节点设置为当前节点。
    如果该节点不在open列表中，则将其加入到open列表，并计算F值，设置其父节点为当前节点。
    转到2步骤
     * @param startMapID 
     * @param endMapID 
     */
    findPath(startMapID: number, endMapID: number, result: number[]): number[] {
        let openList: MapList<number, MapNode> = new MapList()
        let close: MapList<number, MapNode> = new MapList()
        let startNode = new MapNode(startMapID)
        this.updateF(startNode, endMapID, null)
        //将初始节点放入到open列表中。
        openList.insert(startNode.mapID, startNode, (a: MapNode, b: MapNode) => {
            return a.F > b.F;
        })
        // openList.push(startNode.mapID,startNode)
        let cur: MapNode = null;
        while (true) {
            if (openList.length == 0) {//判断open列表。如果为空，则搜索失败。
                return;
            } else {
                if (openList.has(endMapID)) {//如果open列表中存在目标节点，则搜索成功。
                    let node = new MapNode(endMapID)
                    node.parent = cur;
                    close.push(endMapID, node)
                    // let result: number[] = []
                    let parent = node.parent;
                    while (parent) {
                        result.splice(0, 0, parent.mapID)
                        parent = parent.parent;
                    }
                    result.push(endMapID)
                    return;
                }
                //从open列表中取出F值最小的节点作为当前节点，//并将其加入到close列表中
                cur = openList.getByIndex(0)
                openList.remove(cur.mapID, cur)
                close.push(cur.mapID, cur)
                let index = this.map.getStickIndex(cur.mapID)
                //计算当前节点的相邻的所有可到达节点，生成一组子节点。对于每一个子节点：
                for (let dir = 0; dir < this._dirNum; dir++) {
                    let flag = this.delegator.canMove(dir, index)
                    if (flag) {
                        let id = this.delegator.getDirID(dir, index)
                        // cc.warn(' find id ==================== ',id)
                        if (id == endMapID) {
                            let node = new MapNode(id)
                            node.parent = cur;
                            close.push(id, node)
                            let parent = node.parent;
                            while (parent) {
                                result.splice(0, 0, parent.mapID)
                                parent = parent.parent;
                            }
                            result.push(endMapID)
                            return;
                        } else {

                            if (!close.has(id)) {

                                if (!openList.has(id)) {
                                    //如果该节点不在open列表中，则将其加入到open列表，
                                    //并计算F值，设置其父节点为当前节点。
                                    let node = new MapNode(id)
                                    node.parent = cur;
                                    this.updateF(node, endMapID, cur)
                                    openList.insert(node.mapID, node, (a: MapNode, b: MapNode) => {
                                        return a.F > b.F;
                                    })
                                } else {
                                    //如果该节点在open列表中，则检查其通过当前节点计算得到的F值是否更小，
                                    //如果更小则更新其F值，并将其父节点设置为当前节点。
                                    let node = openList.getByKey(id)
                                    this.updateF(node, endMapID, cur)
                                    if (node.F > cur.F) {
                                        //还原之前的F值
                                        this.updateF(node, endMapID, node.parent)
                                    } else {
                                        node.parent = cur;
                                    }
                                }

                            } else {//如果该节点在close列表中，则丢弃它
                                //丢弃
                            }
                        }
                    } else {
                        //不可达
                    }

                }

            }
        }

    }




}

export class MapNode {

    protected _parent: MapNode = null;

    protected _mapID: number = 0;

    protected _g: number = 0;

    protected _h: number = 0;

    constructor(id: number) {
        this._mapID = id;
    }

    set g(v: number) {
        this._g = v;
    }

    get g() {
        return this._g;
    }

    set h(v: number) {
        this._h = v;
    }

    get h() {
        return this._h;
    }

    set parent(v: MapNode) {
        this._parent = v;
    }

    get parent() {
        return this._parent;
    }

    get mapID() {
        return this._mapID
    }

    get F() {
        return this._g + this._h
    }


}
