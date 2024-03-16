import GameMap from "./GameMap";
import MoveSystem from "./MoveSystem";
import { EventDispatcher } from "../event";
import MoveCamera from "./MoveCamera";
import { OPPSITE_DIR, OPPSITE, DIR } from "../tools/Define";
import { G, SCREEN_Y } from "./MoveConfig";
import Utils from "../tools/Utils";
import { Vector2 } from "../../engine/unity";





export class PhysicalManager extends EventDispatcher {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }


    protected objects: MoveSystem[] = []

    protected planes: MoveSystem[] = []

    protected map: GameMap;

    protected camera: MoveCamera = new MoveCamera()


    addGround() {

    }

    setMap(map: GameMap) {
        this.map = map;
        this.camera.setMap(this.map)
    }

    setCameraLeftTop() {
        this.setCameraPosition(0, 0)
    }

    setCamerLeftBottom() {
        this.setCameraPosition(0, this.map.getMapHeight() - this.camera.getHeight())
    }

    setCameraPosition(x: number, y: number) {
        this.camera.setX(x)
        this.camera.setY(y)
        console.log(' this.camera.x ', this.camera.getX())
        console.log(' this.camera.y ', this.camera.getY())
    }

    init(w: number, h: number, d: number = 0, cw: number, ch: number, cd: number) {
        this.map.init(w, h, d)
        this.camera.init(cw, ch, cd)
    }

    size() {
        return this.objects.length;
    }

    getCamera() {
        return this.camera;
    }

    getMap() {
        return this.map;
    }

    addPlane(obj: MoveSystem) {
        let index = this.planes.indexOf(obj)
        if (index < 0) {
            this.planes.push(obj)
        }

    }
    removePlane(obj: MoveSystem) {
        let index = this.planes.indexOf(obj)
        if (index >= 0) {
            this.planes.splice(index, 1)
        }
    }

    add(obj: MoveSystem) {
        let index = this.objects.indexOf(obj)
        if (index < 0) {
            this.objects.push(obj)
        }

    }

    remove(obj: MoveSystem) {
        let index = this.objects.indexOf(obj)
        if (index >= 0) {
            this.objects.splice(index, 1)
        }
    }


    clear() {
        this.objects.length = 0;
        this.planes.length = 0;
    }

    update() {
        for (let index = 0; index < this.planes.length; index++) {
            const element = this.planes[index];
            this.updatePosition(element)
            this.camera.adjustPosition(element)
        }
        // console.log('  this.objects.length ', this.objects.length)
        for (let index = 0; index < this.objects.length; index++) {
            const element = this.objects[index];
            this.updatePosition(element)
            this.camera.adjustPosition(element)
        }
    }

    /**
     * 
     * @param pos 屏幕坐标
     */
    getWorldPosition(pos: any) {
        let result = new Vector2()
        result.x = this.camera.getX() + pos.x;
        result.y = this.camera.getY() + pos.y;
        return result;
    }
    /**
     * 不同的对象可走范围是不一样的。
     * @param npc 
     * @param lx 左边边界
     * @param width 可走宽度
     */
    updatePosition(npc: MoveSystem) {
        let map: GameMap = this.map;
        let spx = npc.getSpeedX()
        let n = npc.getElasticity()
        // console.log(' spx =============  ', spx)
        if (spx > 0) {
            let x = npc.getX()
            let dirx = OPPSITE[npc.getMoveXDir()]
            // console.log(' dirx ', dirx)
            x += dirx * spx;
            // console.log(' x =========== ', x)
            // let lx = map.getRangeX();
            // let width = map.getRangeWidth()
            // let rx = lx + width
            // if (x < lx) { //到达地图左边
            //     console.log(' x < lx')
            //     x = lx;
            //     if (n != 0) {
            //         npc.setMoveXDir(OPPSITE_DIR[dirx])
            //         spx = n * spx
            //     } else {
            //         npc.setSpeedX(0)
            //     }
            // } else if (x > rx) { //到达地图右边
            //     console.log(' x > rx')
            //     x = rx
            //     if (n != 0) {
            //         spx = n * spx
            //         npc.setMoveXDir(OPPSITE_DIR[dirx])
            //         npc.setSpeedX(spx)
            //     } else {
            //         npc.setSpeedX(0)
            //     }

            // }
            npc.setX(x)
        }



        let spz = npc.getSpeedZ()
        if (spz > 0) {
            let z = npc.getZ()
            let dirz = OPPSITE[npc.getMoveZDir()]
            // cc.log(' dirz ', dirz, ' spz ', spz, npc.getMoveZDir())
            z += dirz * spz;

            let bz = map.getRangeZ()
            let tz = map.getTop()
            if (z < bz) {//到达底部
                z = bz;
                if (n != 0) {
                    spz = n * spz
                    npc.setMoveZDir(OPPSITE_DIR[dirz])
                    npc.setSpeedZ(spz)
                } else {
                    npc.setSpeedZ(0)
                }

            } else if (z > tz) {//到达顶部
                z = tz
                if (n != 0) {
                    spz = n * spz
                    npc.setMoveZDir(OPPSITE_DIR[dirz])
                    npc.setSpeedZ(spz)
                } else {
                    npc.setSpeedZ(0)
                }

            }
            npc.setZ(z)
        }


        if (npc.isG()) {
            let y = npc.getY()
            let disy = npc.getSpeedY()

            let tempY = y;
            y += SCREEN_Y * disy;//test
            npc.setY(y)
            let plane: MoveSystem = this.getPlane(npc);
            // console.log(' plane ', plane)
            if (plane) {
                let collide = npc.getCollide()
                if (collide) {
                    let index = npc.b.indexOf(plane)
                    if (index < 0) {
                        npc.b.push(plane)
                        collide.onCollideEnter(npc, plane)
                    }
                }
                if (disy <= 0) {//如果物理在下落
                    let dir: DIR = plane.getDir(npc)
                    // console.log(' dir ==================== ', dir)
                    // let midY = plane.getMidY()
                    if (dir == DIR.UP) {
                        y = plane.getTop()
                        if (tempY != y) {
                            // console.log(' move tempy y ', tempY, y)
                            npc.setOnGroundFlag(true)//碰到平台或者地面
                        }
                        if (n != 0) {//有弹力数值
                            if (disy != 0) {//y方向的速度不等于0
                                let spy = n * -disy
                                //         // cc.log(' disy ', disy, ' spy ', spy)
                                if (spy <= 1) {
                                    // npc.setStop(true)
                                    npc.setSpeedY(0)
                                } else {
                                    npc.setSpeedY(spy)
                                }
                            }
                        } else {
                            npc.setSpeedY(0)
                        }
                        if (npc.getSpeedY() == 0) {
                            let sub = npc.getFrictional()
                            if (sub != 0) {//有摩擦力
                                if (spx > 0) {
                                    spx -= sub
                                    if (spx < 0) {
                                        spx = 0;
                                    }
                                    npc.setSpeedX(spx)
                                }

                                if (spz > 0) {
                                    spz -= sub
                                    if (spz < 0) {
                                        spz = 0;
                                    }
                                    npc.setSpeedZ(spz)
                                }
                            }
                        }
                    }

                }


            } else if (y > 0) {
                npc.setSpeedY(disy - G)
                if (npc.isOnGround) {
                    npc.setOnGroundFlag(false)
                }


            }
            npc.setY(y)
            // if (y <= 0) {
            //     y = 0

            //     if (tempY != y) {
            //         // console.log(' move tempy y ', tempY, y)
            //         npc.emitGround()
            //     }
            // } else if (y > 0) {
            //     npc.setSpeedY(disy - G)
            // }
            // npc.setY(y)
            // if (y == 0) {//在地面上
            //     if (n != 0) {//有弹力数值
            //         if (disy != 0) {//y方向的速度不等于0
            //             let spy = n * -disy
            //             //         // cc.log(' disy ', disy, ' spy ', spy)
            //             if (spy <= 1) {
            //                 // npc.setStop(true)
            //                 npc.setSpeedY(0)
            //             } else {
            //                 npc.setSpeedY(spy)
            //             }
            //         }
            //     } else {
            //         npc.setSpeedY(0)
            //     }
            // }

        }

        // if (y == 0) {//在地面上
        //     let sub = npc.getFrictional()
        //     if (sub != 0) {//有摩擦力
        //         if (spx > 0) {
        //             spx -= sub
        //             if (spx < 0) {
        //                 spx = 0;
        //             }
        //             npc.setSpeedX(spx)
        //         }

        //         if (spz > 0) {
        //             spz -= sub
        //             if (spz < 0) {
        //                 spz = 0;
        //             }
        //             npc.setSpeedZ(spz)
        //         }
        //     }
        // }


    }

    getPlane(obj: MoveSystem) {
        // console.log(' this.planes.length  ', this.planes.length, 'y', y)
        for (let index = this.planes.length - 1; index >= 0; index--) {
            const element = this.planes[index];
            if (obj != element) {
                // console.log('element.getTop() ', element.getTop())
                let flag = Utils.isRecctCollideRect3(obj.getLeft(), obj.getRight(), obj.getTop(), obj.getBottom(),
                    element.getLeft(), element.getRight(), element.getTop(), element.getBottom())
                if (flag) {
                    return element;
                } else {
                    let idx = obj.b.indexOf(element)
                    if (idx >= 0) {
                        obj.b.splice(idx, 1)
                    }
                }
            }

        }
        return null;
    }
}