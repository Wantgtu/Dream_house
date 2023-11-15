import { EventProxy, GEventProxy } from "./event";
import UIManager, { LayerInterface } from "./ui";
import { BaseModel } from "./model";
import EngineView from "../engine/EngineView";

export class BaseView extends EngineView implements LayerInterface {



    protected model: any = null;


    protected controller: any = null;

    protected eventProxy: EventProxy = new EventProxy();

    protected gEventProxy: GEventProxy = new GEventProxy();

    protected uiState: number = 0;//ui的状态
    protected path: string = ''


    setPath(p: string) {
        this.path = p
    }

    getPath() {
        return this.path;
    }
    setModel(m: BaseModel) {
        if (this.model) {
            this.eventProxy.offAll()
        }
        this.model = m;
        if (this.model) {
            this.eventProxy.setDispatcher(this.model)
            this.addListener()
        }



    }

    getModel() {
        return this.model;
    }

    setController(c: any) {
        this.controller = c;
    }

    getController() {
        return this.controller;
    }


    onDestroy() {
        super.onDestroy()
        this.eventProxy.offAll()
        this.gEventProxy.offAll();
    }


    addListener() {

    }

    show() {
        UIManager.instance().pushView(this)
    }

    hide() {
        UIManager.instance().popView(this)
    }

    close() {
        UIManager.instance().popView(this)
    }

    getID() {
        if (this.model) {
            return this.model.getID()
        }
        return 0;
    }

}
export class BaseItemView extends BaseView {



    protected index: number = 0;


    setIndex(index: number) {
        this.index = index;
    }

    getIndex() {
        return this.index;
    }


}
