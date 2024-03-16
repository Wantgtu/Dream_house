import { ResInterface, ResType } from "../cfw/res";
import { TSRef } from "../cfw/core";

export default class ResHelper extends TSRef implements ResInterface {

    protected mgr: cc.AssetManager.Bundle;

    //todo 先观察是否需要使用name
    protected name: string = '';
    constructor(mgr: cc.AssetManager.Bundle, name: string = '') {
        super();
        this.mgr = mgr;
        if (!this.mgr) {
            this.mgr = cc.resources;
        }
    }

    /**
      * 加载资源
      * @param url 
      * @param type 
      * @param callback 
      */
    loadRes(url: string, type: number, callback: (error: Error, assets: any) => void, onProgress?: (finished: number, total: number, item?: any) => void): void {
        // cc.log(' this.name ', this.name, ' type ', type)
        switch (type) {
            case ResType.Prefab:

                this.mgr.load(url, cc.Prefab, callback)
                break;
            case ResType.Texture2D:
                this.mgr.load(url, cc.Texture2D, callback)
                break;
            case ResType.SpriteFrame:
                this.mgr.load(url, cc.SpriteFrame, callback)
                break;
            case ResType.Json:
                this.mgr.load(url, cc.JsonAsset, callback)
                break;
            case ResType.SpriteAtlas:
                this.mgr.load(url, cc.SpriteAtlas, callback)
                break;
            case ResType.Particle2D:
                this.mgr.load(url, cc.ParticleAsset, callback)
                break;
            case ResType.AudioClip:
                this.mgr.load(url, cc.AudioClip, callback)
                break;
            case ResType.AssetBundle:
                // console.log('loadRes 111 ')
                cc.assetManager.loadBundle(url, callback)
                // console.log('loadRes 2222 ')
                break;
            case ResType.Scene:
                // cc.resources.preloadScene(url, callback)
                //cc.log('loadRes  url ', url)
                this.mgr.loadScene(url, callback)

                // let func: ResCallback = (err: any, res: any) => {
                //     cc.log(' err ==  ', err)
                //     callback(err, res)
                // }
                // this.mgr.load(url, cc.SceneAsset, func)
                break;
            case ResType.Remote:
                cc.assetManager.loadRemote(url, callback)
                break;
        }
    }


    /**
     * 清理资源
     * @param url 
     */
    release(url: string, type: ResType): void {
        // cc.loader.release(url);
        // cc.resources.release(asset)
        console.warn('release  url ', url)
        let asset = this.getRes(url, type)
        cc.assetManager.releaseAsset(asset);
    }

    getRes(url: string, type: number): any {
        switch (type) {
            case ResType.Prefab:
                return this.mgr.get(url, cc.Prefab);
            case ResType.Texture2D:
                return this.mgr.get(url, cc.Texture2D);
            case ResType.SpriteFrame:
                return this.mgr.get(url, cc.SpriteFrame);
            case ResType.Json:
                return this.mgr.get(url, cc.JsonAsset);
            case ResType.SpriteAtlas:
                return this.mgr.get(url, cc.SpriteAtlas);
            case ResType.Particle2D:
                return this.mgr.get(url, cc.ParticleAsset)
            case ResType.AudioClip:
                return this.mgr.get(url, cc.AudioClip)
            case ResType.Scene:
                return this.mgr.get(url, cc.SceneAsset)
            case ResType.AssetBundle:
                return cc.assetManager.getBundle(url)
            case ResType.Remote:
                return null;
            default:
                console.error(' getRes error url is ', url, ' type is ', type)
                return null;
        }

    }

    getDependsRecursively(res: any): any {
        // return cc.loader.getDependsRecursively(res)
        return []
    }

    clear() {

    }
}