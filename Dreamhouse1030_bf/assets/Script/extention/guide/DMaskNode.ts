import { GameView } from "../../logic/game/view/GameView";
import { GridItemView } from "../../logic/game/view/GridItemView";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DMaskNode extends cc.Component {

    @property
    foodID: number = 0;

    @property(GameView)
    game: GameView = null;

    start() {
        let grid: GridItemView = this.game.getGridByFoodID(this.foodID)
        if (grid)
            this.node.setPosition(grid.getPos())
    }

    // update (dt) {}
}
