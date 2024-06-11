import GameEventAdapter from "../GameEventAdapter";
import { GameEventName } from "../GameEventConfig";
import EventManager from "../model/EventManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameEventView extends cc.Component {

    protected model: EventManager
    start() {
        this.model = GameEventAdapter.instance().getEventManager()
        this.model.on(GameEventName.EVENT_START, this.eventStart, this)
        this.model.on(GameEventName.EVENT_END, this.eventEnd, this)
        if (this.model.isOpen()) {
            this.eventStart();
        }
    }

    eventStart() {
        // console.log('eventStart ')
        if (!this.node.getComponent(cc.BlockInputEvents))
            this.node.addComponent(cc.BlockInputEvents)
    }

    eventEnd() {
        // console.log('eventEnd ')
        this.node.removeComponent(cc.BlockInputEvents)
    }


}