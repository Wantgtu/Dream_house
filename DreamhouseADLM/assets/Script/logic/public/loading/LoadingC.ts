

import { BaseController } from "../../../cfw/mvc";
import { LoadResItem, ResType, ResItem } from "../../../cfw/res";
import { ModuleManager } from "../../../cfw/module";
import TipC from "../tip/TipC";
import { GameText } from "../../../config/GameText";
import { ModuleID } from "../../../config/ModuleConfig";
import { UIIndex } from "../../../config/UIConfig";
import ViewManager from "../../../cfw/tools/ViewManager";
//针对某个模块加载资源
export default class LoadingC extends BaseController {


    static LOAD_RES: string = 'LOAD_RES'
    static LOAD_RESET: string = 'LOAD_RESET'
    static LOAD_ITEM: string = 'LOAD_ITEM'

    protected resList: LoadResItem[] = []
    protected callback: Function;
    //是否支持异步加载
    protected async: boolean = false;

    protected loadingList: LoadResItem[]
    protected totalCount: number = 1;

    protected errorList: LoadResItem[] = []

    load(callback: Function) {
        this.callback = callback;
        this.reload()
    }

    reload() {
        // console.log(' LoadingC reload')
        this.reset(this.getLoadingList())
        // console.log(' this.loadingList.length  ', this.loadingList.length)
        if (this.isAsync()) {
            this.loadAsync();
        } else {
            this.loadSync()
        }

    }

    getTotalCount() {
        return this.totalCount;
    }

    reset(list: LoadResItem[]) {
        this.loadingList = list
        this.totalCount = list.length;
        this.emit(LoadingC.LOAD_RESET)
    }


    loadAsync() {
        let step: number = 0;
        while (this.loadingList.length > 0) {
            let loadingitem = this.loadingList.shift()

            ModuleManager.loadRes(loadingitem.getModuleID(),
                loadingitem.getUrl(), loadingitem.getType(), (err, item: ResItem) => {
                    step++;
                    if (err) {
                        this.errorList.push(loadingitem)

                    } else {

                    }
                    if (this.totalCount != 0) {
                        // this.progressBar$VSprite.progress = step / this.totalCount;
                        this.emit(LoadingC.LOAD_RES, step)
                    }
                    if (step >= this.totalCount) {
                        if (this.errorList.length > 0) {
                            //有加载失败的，弹出提示是否继续加载
                            TipC.instance().intoLayer(GameText.zh.RES_LOAD_ERROR, (s: number) => {
                                if (s == 1) {
                                    this.reset(this.errorList.slice(0))
                                    this.errorList.length = 0;
                                    this.loadAsync()
                                } else {
                                    //cc.game.end()
                                }
                            })
                        } else {
                            this.loadingFinish()
                        }
                    }

                })
        }

    }

    getLeftSize() {
        return this.loadingList.length;
    }

    loadSync() {
        if (this.totalCount != 0) {
            this.emit(LoadingC.LOAD_RES, (this.totalCount - this.loadingList.length))
            // this.progressBar$VSprite.progress = (this.totalCount - this.loadingList.length) / this.totalCount;
        }

        if (this.loadingList.length > 0) {
            let loadingitem = this.loadingList.shift()
            this.emit(LoadingC.LOAD_ITEM, loadingitem)

            ModuleManager.loadRes(loadingitem.getModuleID(), loadingitem.getUrl(), loadingitem.getType(), (err, item: ResItem) => {

                if (err) {
                    console.log('loadSync error ', err)
                    console.log(' loadingitem.getModuleID() ', loadingitem.getModuleID())
                    console.log('loadingitem.getUrl()', loadingitem.getUrl())
                    this.errorList.push(loadingitem)
                }
                this.addRes(loadingitem)
                this.loadSync()
            })
        } else {

            if (this.errorList.length > 0) {
                //有加载失败的，弹出提示是否继续加载
                TipC.instance().intoLayer(GameText.zh.RES_LOAD_ERROR, (s: number) => {
                    if (s == 1) {
                        this.reset(this.errorList.slice(0))
                        this.errorList.length = 0;
                        this.loadSync()
                    } else {
                        // cc.game.end()
                    }
                })
            } else {
                this.loadingFinish()
            }

        }
    }

    isAsync() {
        return this.async;
    }

    setAsync(f: boolean) {
        this.async = f;
    }


    intoLayer(callback: Function, uiIndex: UIIndex = UIIndex.ROOT) {
        this.callback = callback;
        // this.pushToast('loading/LoadingView', null, ModuleManager.getLoader(ModuleID.RES), uiIndex, LoadingView)
        ViewManager.pushUIToast({
            path: 'loading/LoadingView',
            moduleID: ModuleID.RES,
            uiIndex: uiIndex,
            controller: this,

        })
    }



    addItemList(list: string[], type: ResType, mid: string, tip: string) {
        for (let index = 0; index < list.length; index++) {
            const url = list[index];
            this.addItem(url, type, mid, tip)
        }
        // console.log('getLoadingList this.resList.length  ', list.length, this.resList.length)
    }

    addItem(url: string, type: ResType, moduleID, tip: string) {
        this.resList.push(new LoadResItem(url, type, moduleID, tip))
    }


    getLoadingList(): LoadResItem[] {
        // console.log('getLoadingList this.resList.length  ', this.resList.length)
        let list = this.resList.slice(0)
        // console.log('getLoadingList list.length  ', list.length)
        return list;
    }


    protected addRes(element: LoadResItem) {
        // console.log(' addRes ')
        let type = element.getType()
        let url = element.getUrl()
        // console.log(' type ', type)
        // console.log(' url ', url, element.getModuleID())
        switch (type) {
            case ResType.AssetBundle:
                let res = ModuleManager.getRes(element.getModuleID(), url, type)
                // res = ModuleManager.getLoader(element.getModuleID()).getRes(url, type)
                // console.log(' res == ', res)
                ModuleManager.setLoaderByBundle(url, res)
                break;
            case ResType.Json:
                let data = ModuleManager.getRes(element.getModuleID(), url, type)
                // data =  ModuleManager.getLoader(element.getModuleID()).getRes(url, type)
                // console.log(' data == ', data)
                ModuleManager.addFile(data, url)
                break;
            case ResType.Prefab:
                break;
        }
        // console.log('addRes =================== ', type)
    }


    loadingFinish(): void {
        if (this.isAsync()) {
            for (let index = 0; index < this.resList.length; index++) {
                const element = this.resList[index];
                this.addRes(element)
            }
        }

        this.resList.length = 0;
        if (this.callback) {
            this.callback();
        }

    }

}