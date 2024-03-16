import MoveSystem from "./MoveSystem";
import MoveCamera from "./MoveCamera";
import { PhysicalManager } from "./PhysicalManager";
import { DIR } from "../tools/Define";
import { MoveObject } from "./MoveObject";

/**
 * 地面循环滚动处理类
 */

export default class GroundManager {


    person: MoveSystem = null;

    protected _objectList: MoveSystem[] = []
    protected camera: MoveCamera;

    start(objectList: MoveObject[]) {
        this.camera = PhysicalManager.instance().getCamera()
        let x = 0;
        for (let index = 0; index < objectList.length; index++) {
            const element = objectList[index]
            this._objectList[index] = element.moveSystem;
            console.log(' element.width * index ', element.getWidth() * index)
            this._objectList[index].setX(element.getWidth() * index)
        }
    }


    update(dt: number) {
        if (this.person.getSpeedX() != 0) {
            let dir: DIR = this.person.getMoveXDir()
            let first = this._objectList[0]
            let tail = this._objectList[this._objectList.length - 1]
            if (dir == DIR.RIGHT) {
                if (first.getX() + first.node.getWidth() < this.camera.getX()) {
                    this._objectList.push(this._objectList.shift())
                    first.setX(tail.getX() + first.node.getWidth())
                }
            } else {
                if (tail.getX() > this.camera.getX() + this.camera.getWidth()) {
                    tail.setX(first.getX() - tail.node.getWidth())
                    this._objectList.unshift(this._objectList.pop())
                }
            }
        }

    }


}
