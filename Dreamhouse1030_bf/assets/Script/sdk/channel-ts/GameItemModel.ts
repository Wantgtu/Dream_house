import ChannelUtils from "./ChannelUtils";




export default class GameItemModel {

    protected priority: number = 0;

    getGameName() {
        return ''
    }

    getGameIcon() {
        return ''
    }

    getData() {
        return null;
    }

    subPriority() {

        this.priority = ChannelUtils.random(this.priority, this.priority + 10)
        // if (this.priority > 0) {
        //     this.priority--;
        // }
    }

    getPriority() {
        return this.priority;
    }
}
