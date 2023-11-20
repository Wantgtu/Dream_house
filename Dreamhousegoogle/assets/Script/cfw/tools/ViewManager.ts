import { TSMap } from "../struct";
import { ModuleManager, Module } from "../module";
import { BaseModel } from "../model";
import { ResItem, ResType } from "../res";
import { BaseView } from "../view";
import { BaseController } from "../mvc";
import UIManager from "../ui";
import { engine } from "../../engine/engine";

export default class ViewManager {
    private static viewMap: TSMap<string, boolean> = new TSMap()
    /**
     * 将某个预制体实例化后添加到给定的节点中
     * @param prefab 
     * @param parent 
     * @param func 
     * @param className 
     */
    // static addPrefabToParent(prefab: any, parent: any, func?: Function, className?: any) {
    //     let node = engine.instantiate(prefab)
    //     if (!node) {
    //         return null;
    //     }
    //     if (!className) {
    //         className = node.name;
    //     }
    //     let component = node.getComponent(className)
    //     if (component) {
    //         if (engine.isValid(parent)) {
    //             // parent.addChild(node);
    //             engine.addChild(node, parent)
    //         }
    //         if (func) {
    //             func(component);
    //         }
    //     } else {
    //         console.warn(" comp is null ", name);
    //         if (func) {
    //             func(null);
    //         }
    //     }

    // }


    static pushPrefabView(param: { prefab: any, uiIndex: number, model?: BaseModel, controller?: BaseController, className?: any }): void {
        let comp: BaseView = this.getPrefab(param.prefab, param.uiIndex, param.className)
        if (param.model) {
            comp.setModel(param.model)
        }
        if (param.controller) {
            comp.setController(param.controller)
        }
        comp.show()
    }

    /**
     * 将一个预制体实例化后添加到UI管理器中。
     * @param prefab 
     * @param uiIndex 
     * @param className 
     */
    static getPrefab(prefab: any, uiIndex: number, className?: any): BaseView {
        if (prefab) {
            let node = engine.instantiate(prefab)
            if (!node) {
                return null;
            }
            if (!className) {
                className = node.name;
            }
            let component: BaseView = engine.getComponent(node, className)
            if (component) {
                component.setUIIndex(uiIndex)
                return component
            } else {
                console.warn(" comp is null ", className);
                return null;
            }
        } else {
            return null;
        }

    }





    /**
     * 将给定路径的预制体实例化后添加到UI管理器中。
     * 与pushView 的区别是 不受时间间隔影响。
     * @param path 
     * @param loader 
     * @param uiIndex 
     * @param func 
     * @param className 
     */
    static pushToast(path: string, loader: Module, uiIndex?: number, func?: (view: BaseView) => void, className?: any) {
        if (uiIndex == undefined) {
            uiIndex = 3;
        }
        if (!className) {
            className = this.getClassName(path)
        }
        this.loadPrefab(path, loader, (err, prefab: any) => {
            if (err) {
                console.log(" pushView err " + err + "  name " + prefab);
                if (func) {
                    func(null);
                }
                return;
            }

            let component = this.getPrefab(prefab, uiIndex, className)
            if (component) {
                component.setPath(path)
                if (func) {
                    func(component);
                }
            } else {
                console.warn(" comp is null ", className);
                if (func) {
                    func(null);
                }
            }

        })
    }

    static pushUIToast(param: { path: string, moduleID: string, model?: BaseModel, controller?: BaseController, uiIndex: number, func?: (view: BaseView) => void, className?: any, parent?: any }) {
        this.pushToast(param.path, ModuleManager.getModule(param.moduleID), param.uiIndex, (comp: BaseView) => {
            if (comp) {

                if (param.func) {
                    param.func(comp)
                }
                if (param.model) {
                    comp.setModel(param.model)
                }
                if (param.controller) {
                    comp.setController(param.controller)
                }
                if (param.parent) {
                    comp.addToParent(param.parent)
                } else {
                    comp.show()
                }

            }
        }, param.className)
    }

    /**
     * 将ui添加到管理器中。
     * @param prefab 预制体麓景
     * @param className 组件类型
     * @param model 模型
     * @param uiIndex ui管理器层级
     * @param loader 加载器
     * @param func 加载成功回调
     */
    static pushView(path: string, loader: Module, uiIndex: number, func?: (view: BaseView) => void, className?: any, delayTime: number = 500) {



        if (uiIndex == undefined) {
            uiIndex = 1;
        }
        if (UIManager.instance().hasViewByPath(path, uiIndex)) {
            return;
        }
        if (this.viewMap.has(path)) {
            console.warn(' pushVIew  ', this.viewMap.has(path))
            return;
        }
        this.viewMap.set(path, 1)
        setTimeout(() => {
            this.viewMap.delete(path)
        }, delayTime);
        this.pushToast(path, loader, uiIndex, (comp) => {
            if (func) {
                func(comp)

            }
        }, className)

    }

    /**
     * 
     * @param param 
     */
    static pushUIView(param: { path: string, moduleID: string, model?: BaseModel, controller?: BaseController, uiIndex: number, func?: (view: BaseView) => void, className?: any, parent?: any, after?: (view: BaseView) => void, delayTime?: number }) {
        this.pushView(param.path, ModuleManager.getModule(param.moduleID), param.uiIndex, (comp: BaseView) => {
            if (comp) {
                if (param.func) {
                    param.func(comp)
                }
                if (param.model) {
                    comp.setModel(param.model)
                }
                if (param.controller) {
                    comp.setController(param.controller)
                }
                if (param.parent) {
                    comp.addToParent(param.parent)
                } else {
                    comp.show()
                }
                if (param.after) {
                    param.after(comp)
                }

            }
        }, param.className, param.delayTime)
    }
    /**
     * 
     * @param prefabName 
     * @param loader 
     * @param callback 
     */
    static loadPrefab(prefabName: string, loader: Module, callback: (err: string, node?: any) => void) {
        let resName = prefabName;
        // console.log(' prefabName ', prefabName)
        if (prefabName.indexOf("/") >= 0) {
            let list = prefabName.split("/");
            prefabName = list[list.length - 1];
        }
        if (loader) {
            loader.loadRes(resName, ResType.Prefab,
                (err, item: ResItem) => {
                    if (err) {
                        callback(" UIManager getComponent err " + err);
                        return;
                    }
                    callback(null, item.getRes());
                });
        } else {
            callback('loader is null ' + prefabName, null)
        }

    }

    static loadPrefab2(prefabName: string, moduleID: string, callback: (err: string, node?: any) => void) {
        this.loadPrefab(prefabName, ModuleManager.getModule(moduleID), callback)
    }

    /**
     * 获得预制体上view组件的名称
     * 默认使用预制体文件名称
     * @param prefabName 
     */
    static getClassName(prefabName: string) {
        let className = "";
        if (prefabName.indexOf("/") >= 0) {
            let list = prefabName.split("/");
            className = list[list.length - 1];
        } else {
            className = prefabName;
        }
        return className;
    }
}
