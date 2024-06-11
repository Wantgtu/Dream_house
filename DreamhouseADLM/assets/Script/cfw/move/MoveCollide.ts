
import MoveSystem from "./MoveSystem";

export default interface MoveCollide {


    onCollideEnter(a: MoveSystem, b: MoveSystem)

    onColliding(a: MoveSystem, b: MoveSystem):void

    onCollideExit(a: MoveSystem, b: MoveSystem)
}