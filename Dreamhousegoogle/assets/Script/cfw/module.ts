import { XlsxDataManager } from "./xlsx";
import { ResItem, ResLoader, ResType } from "./res";
import { isNull } from "./tools/Define";
import ResHelper from "../engine/ResHelper";
import { ResultCallback } from "../sdk/sdk/SDKConfig";
export type ModuleItem = { name: string, isBundle: boolean, bundleName: string };

export class Module {

    private loader: ResLoader;

    protected projectName: string = ''

    protected config: ModuleItem;
    protected dataManager: XlsxDataManager;

    constructor(projectName: string, config: ModuleItem) {
        this.projectName = projectName;
        this.config = config;
        //有名称的模块，需要在适当的时候加载bundle 并设置。
        if (!config.isBundle) {//name != '' 的 说明是自定义的bundle。
            // this.setLoader(new ResLoader(new ResHelper(cc.resources, hasSubPackage ? "" : config.bundleName)))
            // this.setAudio()
            // console.log('config.isBundle  ', config.isBundle, config.bundleName)
            this.setLoaderByBundle(null)
        }
        this.dataManager = new XlsxDataManager()
    }



    hasLoader() {
        // console.log('hasLoader ', this.loader)
        return !isNull(this.loader)
    }

    setLoader(loader: ResLoader) {
        this.loader = loader
    }

    setLoaderByBundle(bundle: any) {
        if (!this.hasLoader()) {
            let name = this.config.bundleName;
            let helper = BundleManager.instance().getBundle(name)
            if (!helper) {
                BundleManager.instance().addBundle(name, new ResHelper(bundle, name))
            }
            this.setLoader(new ResLoader(BundleManager.instance().getBundle(name)))
        }

    }

    getDataManager() {
        return this.dataManager;
    }

    isBundle(): boolean {
        return this.config.isBundle;
    }

    getName(): string {
        return this.config.bundleName
    }

    getLoader(): ResLoader {
        return this.loader;
    }

    release(): void {
        if (this.loader) {
            this.loader.release()
        } else {
            console.warn('release loader is null name ', this.getName())
        }
    }

    loadRes(url: string, type: ResType, callback: (err: string, res: ResItem) => void, onProgress?: (count: number, total: number) => void) {
        if (this.loader) {
            this.loader.loadRes(url, type, callback, onProgress)
        } else {
            console.warn('loadRes loader is null name ', this.getName())
        }

    }
    getRes(url: string, type: ResType) {
        if (this.loader) {
            return this.loader.getRes(url, type)
        } else {
            console.warn('getres loader is null')
            return null;
        }
    }
}

export class ModuleManager {

    /**
     * 当前正在使用的模块
     */
    private static moduleID: string = 'res';

    //使用bundle的模块
    private static moduleList: string[] = []

    //模块管理器
    private static moduleMap: { [key: string]: Module } = {}

    private static defaultID: string = 'res'

    static setDefaultID(id: string): void {
        this.defaultID = id;
    }

    static getModuleList() {
        return this.moduleList
    }



    static init(projectName: string, ModuleConfig: ModuleItem[]): void {
        for (let index = 0; index < ModuleConfig.length; index++) {
            let config = ModuleConfig[index]
            let m = new Module(projectName, config);
            if (config.isBundle) {
                this.moduleList.push(config.name)
            }
            this.moduleMap[config.name] = m
        }

    }

    static getRes(moduleID: string, url: string, type: ResType) {
        let loader = this.getModule(moduleID)
        if (loader) {
            return loader.getRes(url, type)
        } else {
            console.warn('getres loader is null')
            return null;
        }
    }

    static loadRes(moduleID: string, url: string, type: ResType, callback: (err: string, res: ResItem) => void, onProgress?: (count: number, total: number) => void) {
        let loader = this.getModule(moduleID)
        if (loader) {
            loader.loadRes(url, type, callback, onProgress)
        } else {
            callback('loader is null name ' + this.name, null)
        }
    }

    static getName(id: string) {
        return this.getModule(id).getName()
    }

    static loadBundle(id: string, callback?: ResultCallback) {
        this.getModule(this.defaultID).loadRes(id, ResType.AssetBundle, (err, item: ResItem) => {
            if (err) {
                if (callback) {
                    callback(0)
                }

                return;
            }
            this.setLoaderByBundle(id, item.getRes())
            if (callback) {
                callback(1)
            }
        })
    }

    static setLoaderByBundle(id: string = this.moduleID, bundle: any) {
        if (this.moduleMap[id]) {
            this.moduleMap[id].setLoaderByBundle(bundle)
        } else {
            console.warn('moduleMap is null  ', id)
        }

    }

    static getModule(id: string): Module {
        return this.moduleMap[id]
    }

    static setModuleID(id: string): void {
        this.moduleID = id;
    }

    // static getLoader(id: string): ResLoader {
    //     if (this.moduleMap[id]) {
    //         return this.moduleMap[id].getLoader()
    //     }
    //     console.warn(' getLoader loader is null')
    //     return null;

    // }

    static release(id: string = this.moduleID): void {
        this.getModule(id).release();
    }

    static hasLoader(id: string = this.moduleID): boolean {
        return this.getModule(id).hasLoader()
    }

    // static publicLoader() {
    //     return this.getModule(this.defaultID).getLoader()
    // }

    //数据管理器默认在res分包下 简化加载处理
    static get dataManager() {
        return XlsxDataManager.instance();
    }


    static addFile(json: any, fileName?: string) {
        this.dataManager.addFile(json, fileName)
    }

    static getData(key: string) {
        return this.dataManager.get(key)
    }
}

export class BundleManager {

    protected bundles: { [key: string]: ResHelper } = {}

    private static ins: BundleManager;

    static instance(): BundleManager {
        if (!this.ins) {
            this.ins = new BundleManager()
        }
        return this.ins;
    }

    addBundle(key: string, bundle: ResHelper): void {
        // console.log(' addBundle key ', key)
        this.bundles[key] = bundle;
    }

    hasBundle(key: string): boolean {
        return this.bundles[key] != null && this.bundles[key] != undefined;
    }

    getBundle(key: string): ResHelper {
        let bundle: ResHelper = this.bundles[key]
        if (bundle) {
            bundle.add()
        }
        return bundle;
    }


    removeBundle(key: string): void {
        let bundle: ResHelper = this.bundles[key]
        if (bundle) {
            bundle.sub();
            if (bundle.getCount() <= 0) {
                this.bundles[key] = null;
            }
        }

    }

}