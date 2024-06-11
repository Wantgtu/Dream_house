
import { EventDispatcher } from "./event";
import { ResLoader } from "./res";
import { BaseView } from "./view";
import ViewManager from "./tools/ViewManager";
import { TSMap } from "./struct";
import Singleton from "./tools/Singleton";
import { Module } from "./module";

export abstract class BaseController extends EventDispatcher {


    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
            (<any>this).ins.initData()
        }
        return (<any>this).ins;
    }

    initData() {

    }
    /**
     * 
     * @param prefab 
     * @param model 
     * @param loader 
     * @param uiIndex 
     * @param className 
     * @param func 
     */
    pushToast(prefab: string, model: any, loader: Module, uiIndex?: number, className?: any, func?: Function) {
        ViewManager.pushToast(prefab, loader, uiIndex, (component: BaseView) => {
            if (component) {
                component.setController(this)
                if (model) {
                    component.setModel(model)
                }
                if (func) {
                    func(component);
                }
                component.show();
            }

        }, className)
    }


    /**
     * 
     * @param prefab 
     * @param model 
     * @param loader 
     * @param uiIndex 
     * @param className 
     * @param func 
     */
    pushView(prefab: string, model: any, loader: Module, uiIndex?: number, className?: any, func?: Function) {

        ViewManager.pushView(prefab, loader, uiIndex, (component: BaseView) => {
            if (component) {
                component.setController(this)
                if (model) {
                    component.setModel(model)
                }
                if (func) {
                    func(component);
                }
                component.show();
            } else {
                console.warn(' component is null prefab ', prefab)
            }

        }, className)
    }



    /**
     * 
     * @param node 
     * @param name 
     * @param model 
     */
    initView(component: BaseView, model?: any) {

        component.setController(this);
        if (model) {
            component.setModel(model);
        }
        return component;
    }



    abstract intoLayer(param?: any, param2?: any): void




}
/**
 * 单例的控制器
 */
export abstract class SingleController extends BaseController {
    private ins: any;

    constructor() {
        super();
        if (!this.ins) {
            this.ins = this;
        }
        return this.ins;
    }


}

export class GameMediator extends Singleton {

    protected controllers: TSMap<string, BaseController> = new TSMap()


    register(funcID: string, c: BaseController) {
        // cc.log('register funcID ', funcID)
        this.controllers.set(funcID, c)
    }

    remove(funcID: string) {
        this.controllers.remove(funcID)
    }

    get(funcID: string) {
        let c = this.controllers.get(funcID)

        if (!c) {
            console.error(' funcID is null ', funcID)
        }
        return c;
    }

    intoLayer(funcID: string, param?: any) {
        let c = this.get(funcID)
        if (c) {
            c.intoLayer(param)
        } else {
            console.log('c is null ')
        }
    }


}