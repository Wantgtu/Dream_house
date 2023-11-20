import GameItemModel from "./GameItemModel";

export default class ZSGameItemModel extends GameItemModel {

    protected data;

    constructor(d) {
        super()
        this.data = d;
    }

    getGameName() {
        return this.data.app_title
    }

    getGameIcon() {
        return this.data.app_icon
    }

    getData() {
        return this.data;
    }

}
