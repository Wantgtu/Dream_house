import MoveSystem from "./MoveSystem";

export interface MoveObject {



    setX(x: number): void;
    getX(): number;

    setY(y: number): void;
    getY(): number;

    setVisible(f: boolean): void
    isVisible(): boolean;
    getAnchorX(): number;
    getAnchorY(): number;
    getWidth(): number;
    getHeight(): number;
    getDepth(): number;
    getScale(): number

    setScale(s: number): void

    setZIndex(i: number): void;

    moveSystem: MoveSystem;


}