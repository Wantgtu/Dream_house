export default interface MoveLayer {

    setAnchorPoint(x: number, y: number): void

    getWidth(): number

    getHeight(): number

    setScale(s: number): void

    setPosition(v: any): void

    getPosition(): any;

    convertToNodeSpaceAR(pos: any): any
}