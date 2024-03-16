/**
 * 自定义的资源分类，对应各个引擎中相同的资源。
 */
export enum ResType {
    Texture2D,
    SpriteFrame,
    SpriteAtlas,
    Prefab,
    Json,
    Scene,
    Material,
    AnimationClip,
    Mesh,
    Particle2D,//粒子效果
    AudioClip,
    AssetBundle,
    Remote,
    Scene3D,
    Sprite3D
}
export type ResCallback = (err: any, res: any) => void

/**
 * 各个引擎需要提供资源的辅助类需要实现的接口
 */
export interface ResInterface {
    /**
     * 
     * @param url 加载资源
     * @param type 
     * @param callback 
     */
    loadRes(url: string, type: ResType, callback: ResCallback, onProgress?: (finished: number, total: number, item?: any) => void): void;

    /**
     * 清理资源
     * @param url 
     */
    release(url: any, type?: ResType): void;

    /**
     * 获取资源
     * @param url 
     * @param ResType 自定义的资源类型 
     */
    getRes(url: string, type: ResType): any;

    /**
     * 获得资源的依赖资源
     * @param url 
     */
    getDependsRecursively(url: any): any;


    clear(): void


}
export class LoadingItem {

    //资源id
    protected url: string;

    //资源类型
    protected type: ResType;

    constructor(url: string, type: ResType) {
        this.url = url;
        this.type = type;
    }

    getUrl() {
        return this.url;
    }

    getType() {
        return this.type;
    }

}
export class LoadResItem extends LoadingItem {
    protected moduleID: string;
    protected tip: string = ''
    constructor(url: string, type: ResType, mid: string, tip: string) {
        super(url, type)

        this.moduleID = mid;
        this.tip = tip;
    }

    getTip() {
        return this.tip;
    }

    getModuleID() {
        return this.moduleID;
    }
}

export class ResItem extends LoadingItem {

    protected resHelper: ResInterface;

    // 全局资源使用计数器。
    protected static resCountMap: { [k: string]: number } = {};

    //尝试加载次数
    private loadCount: number = 0;

    //使用次数
    protected useCount: number = 0;

    //加载是否结束
    protected loadFinish: boolean = false;

    //资源本身
    private res: any;

    //需要通知的函数
    private callbackList: Function[] = []


    constructor(helper: ResInterface, url: string, type?: ResType) {
        super(url, type)
        this.resHelper = helper;
    }

    addCallback(func: Function) {
        this.callbackList.push(func)
    }

    clearCallback() {
        this.callbackList.length = 0;
    }

    //是否加载完毕
    isDone() {
        return this.loadFinish;
    }

    getRes() {
        this.addCount();
        if (!this.res) {
            this.res = this.resHelper.getRes(this.url, this.type)
        }
        return this.res;
    }

    /**
     * 加载完成调用
     * @param flag 
     */
    setLoadingFlag(flag: boolean) {
        this.loadFinish = flag;
        while (this.callbackList.length > 0) {
            let func = this.callbackList.shift();
            func(!flag, this)
        }
    }
    /**
     * 由于引擎加载机制，加载完成就已经使用，
     */
    cacheRes(res: any) {
        this.res = res;
        //加载成功后直接加1，以免被其他模块的记载器清理掉。
        this.addCount()
    }

    //获得加载次数
    getLoadCount() {
        return this.loadCount;
    }
    //更新加载次数
    updateLoadCount() {
        this.loadCount++;
    }
    //获得使用次数
    getUseCount() {
        return this.useCount;
    }

    releaseAll() {
        while (this.useCount > 0) {
            this.release();
        }
    }
    release() {
        if (this.useCount > 0) {
            this.subCount();
            if (this.useCount == 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }


    subCount() {
        this.useCount--;
        let key = this.url + this.type;
        // console.log(' ResItem.resCountMap[key]  ',key, ResItem.resCountMap[key] )
        if (ResItem.resCountMap[key] > 0) {
            ResItem.resCountMap[key]--;

            if (ResItem.resCountMap[key] == 0) {
                // console.log('subCount ResItem.resCountMap[key] ', key, ' key ', ResItem.resCountMap[key])
                this.resHelper.release(this.url, this.type)
                delete ResItem.resCountMap[key];
            }
        }
    }

    addCount() {
        this.useCount++;
        let key = this.url + this.type
        if (!ResItem.resCountMap[key]) {
            ResItem.resCountMap[key] = 0
        }
        ResItem.resCountMap[key]++;
    }

}

/**
 * 1. 负责处理加载逻辑
 * 2. 管理加载项
 * 3. 清理加载项
 * 
 */
export class ResLoader {

    protected helper: ResInterface = null;

    constructor(helper: ResInterface) {
        this.helper = helper
    }

    protected resCache: { [k: string]: ResItem } = {}
    /**
     * 清理单个资源
     * @param url 
     * @param type 
     */
    releaseRes(url: string, type: ResType) {
        let ts = this.getKey(url, type);
        let item = this.resCache[ts];
        if (item) {
            item.releaseAll()
            this.resCache[ts] = null;

        } else {
            console.warn('releaseRes item is null  ts  ', ts)
        }
    }

    /**
    * 删除所有资源
    */
    release() {
        console.log(' ResLoader release ================== ')
        let resources: string[] = Object.keys(this.resCache);
        for (let index = 0; index < resources.length; index++) {
            const key = resources[index];
            const element: ResItem = this.resCache[key];
            if (element) {
                element.releaseAll();
                this.resCache[key] = null;
            } else {
                // console.warn("ResLoader release url  =  is error  ",key)
            }
        }

        this.helper.clear()

    }

    private getKey(url: string, type: ResType) {
        let key = url + type;
        return key;
    }
    /**
     * 同时加载多个资源。
     * @param list 需要加载的资源列表
     * @param type 需要加载的资源类型，要求所有资源统一类型
     * @param func 加载后的回调
     * @param loader 资源加载管理器，默认是全局管理器。
     */
    loadArray(list: Array<string>, type: ResType, func: (err: string, process: number) => void) {
        let resCount = 0;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            this.loadRes(element, type, (err) => {
                // 不论是否都加载成功都返回。
                if (err) {
                    console.log(err);
                    func(err, resCount / list.length);
                    return;
                }
                resCount++;
                func(err, resCount / list.length);
            });
        }
    }


    getItem(url: string, type: ResType) {
        let ts = this.getKey(url, type)
        if (this.resCache[ts]) {
            return this.resCache[ts]
        } else {
            let item = new ResItem(this.helper, url, type);
            this.resCache[ts] = item;
        }

    }

    /**
     * 直接缓存已有的资源，比如在脚本中挂载的资源。
     * @param url 
     * @param type 
     * @param res 
     */
    cacheRes(url: string, type: ResType, res: any) {
        let ts = this.getKey(url, type);
        let item: ResItem = this.resCache[ts]
        if (!item) {
            item = new ResItem(this.helper, url, type);
            item.cacheRes(res)
            this.resCache[ts] = item;
        }
    }

    loadResByPromise(url: string, type: ResType) {
        return new Promise((resolve, reject) => {
            let ts = this.getKey(url, type);
            let item: ResItem = this.resCache[ts]
            // console.log(" loadRes url ", url, ' ts ', ts, ' item ', item);
            if (item && item.isDone()) {
                resolve(item);
                return;
            } else {
                if (!item) {//等待加载成功
                    //     item.addCallback(callback)
                    //     return;
                    // } else {
                    item = new ResItem(this.helper, url, type);
                    this.resCache[ts] = item;
                    // item.addCallback(callback)
                }

            }


            let func = (err: any, res: any) => {
                item.updateLoadCount();
                if (err) {
                    if (item.getLoadCount() <= 3) {
                        console.warn(" item.getLoadCount()  =========== ", item.getLoadCount())
                        this.helper.loadRes(url, type, func);
                    } else {
                        console.warn(" res load fail url is " + url);
                        this.resCache[ts] = null;
                        // callback(err, null);
                        item.setLoadingFlag(false)
                        reject(item)
                    }
                } else {
                    item.cacheRes(res);
                    if (this.resCache[ts]) {
                        // item.setLoadingFlag(true)
                        resolve(item);
                        // callback(err, item);
                    } else {
                        //处理加载完之前已经删除的资源
                        item.subCount();
                    }


                }
            }
            this.helper.loadRes(url, type, func);
        })
    }

    /**
     * 加载单个文件
     * @param url 
     * @param type 
     * @param callback 
     */
    loadRes(url: string, type: ResType, callback: (err: string, res: ResItem) => void, onProgress?: (count: number, total: number) => void) {
        let ts = this.getKey(url, type);
        let item: ResItem = this.resCache[ts]
        // console.log(" loadRes url ", url, ' ts ', ts, ' item ', item);
        if (item && item.isDone()) {
            callback(null, item);
            return;
        } else {
            if (item) {//等待加载成功
                item.addCallback(callback)
                return;
            } else {
                item = new ResItem(this.helper, url, type);
                this.resCache[ts] = item;
                item.addCallback(callback)
            }

        }


        let func = (err: any, res: any) => {
            item.updateLoadCount();
            if (err) {
                if (item.getLoadCount() <= 3) {
                    console.warn(" item.getLoadCount()  =========== ", item.getLoadCount())
                    this.helper.loadRes(url, type, func, onProgress);
                } else {
                    console.warn(" res load fail url is " + url);
                    this.resCache[ts] = null;
                    // callback(err, null);
                    item.setLoadingFlag(false)
                }
            } else {
                item.cacheRes(res);
                if (this.resCache[ts]) {
                    item.setLoadingFlag(true)
                    // callback(err, item);
                } else {
                    //处理加载完之前已经删除的资源
                    item.subCount();
                }


            }
        }
        this.helper.loadRes(url, type, func, onProgress);
    }



    /**
     * 获取资源的唯一方式 
     * @param url 
     * @param type 
     */
    getRes(url: string, type: ResType) {
        let ts = this.getKey(url, type)
        let item = this.resCache[ts];
        if (item) {
            return item.getRes();
        } else {
            let res = this.helper.getRes(url, type);
            if (res) { // 如果其他管理器已经加载了资源，直接使用。
                console.log(' 其他加载器已经加载了次资源 ', url)
                let item = new ResItem(this.helper, url, type);
                item.cacheRes(res)
                this.resCache[ts] = item
                return item.getRes();
            } else {
                console.warn('getRes url ', url, ' ts ', ts)
            }

        }
        return null;
    }

}
