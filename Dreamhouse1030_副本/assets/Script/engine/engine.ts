

// export class NPCObject {
//     protected node: cc.Node;
//     constructor(n: cc.Node) {
//         this.node = n;
//     }
//     set scaleX(s: number) {
//         this.node.scaleX = s;
//     }

//     get scaleX(): number {
//         return this.node.scaleX
//     }
// }

class LocalStorage {


    getItem(key) {
        return cc.sys.localStorage.getItem(key);
    }

    getLength() {
        return cc.sys.localStorage.length
    }

    setItem(key, value) {
        cc.sys.localStorage.setItem(key, value);
    }

    clear() {
        cc.sys.localStorage.clear();
    }

    removeItem(key) {
        cc.sys.localStorage.removeItem(key);
    }
}


class AudioEngine {

    getMaxAudioInstance() {
        return cc.audioEngine.getMaxAudioInstance();
    }

    playMusic(res: any, isLoop: boolean) {
        return cc.audioEngine.playMusic(res, isLoop);
    }


    setFinishCallback(audioId: any, func: Function) {
        cc.audioEngine.setFinishCallback(audioId, func);
    }

    pauseMusic() {
        cc.audioEngine.pauseMusic();
    }

    resumeMusic() {
        cc.audioEngine.resumeMusic();
    }

    stopMusic() {
        cc.audioEngine.stopMusic();
    }

    setMusicVolume(count: number) {
        cc.audioEngine.setMusicVolume(count);
    }

    isMusicPlaying() {
        return cc.audioEngine.isMusicPlaying();
    }

    playEffect(res: any, playCount: number, func?: Function) {
        let isLoop = playCount == 0 ? true : false
        let audioID: any = cc.audioEngine.playEffect(res, isLoop);
        if (func) {
            this.setFinishCallback(audioID, func)
        }
        return audioID
    }

    pauseEffect(audioId) {
        cc.audioEngine.pauseEffect(audioId);
    }



    resumeEffect(audioId) {
        cc.audioEngine.resumeEffect(audioId);
    }

    setEffectsVolume(count) {
        cc.audioEngine.setEffectsVolume(count);
    }

    stopEffect(audioId) {
        cc.audioEngine.stopEffect(audioId);
    }


    uncacheAll() {
        cc.audioEngine.uncacheAll()
    }
}



export class engine {


    static audioEngine: AudioEngine = new AudioEngine()

    static localStorage: LocalStorage = new LocalStorage()

    static getWritablePath(): string {
        return jsb.fileUtils.getWritablePath()
    }

    static writeStringToFile(data, filePath): void {
        jsb.fileUtils.writeStringToFile(data, filePath)
    }

    static isFileExist(filePath): boolean {
        return jsb.fileUtils.isFileExist(filePath)
    }
    static getStringFromFile(filePath): string {
        return jsb.fileUtils.getStringFromFile(filePath)
    }

    static addChild(node: cc.Node, parent: cc.Node) {
        parent.addChild(node)
    }
    /**
     * 
     * @param className 
     * @param methodName 
     * @param parameters 
     * @param methodSignature 
     */
    static callStaticMethod(className, methodName, parameters, methodSignature = "(Ljava/lang/String;)V") {
        console.log(" JsNativeBridge callStaticMethod ", cc.sys.isNative)
        if (!cc.sys.isNative) {
            return -1;
        }
        console.log(" JsNativeBridge callStaticMethod ", methodName, parameters)
        if (cc.sys.os == cc.sys.OS_IOS) {
            let result = jsb.reflection.callStaticMethod(className, methodName, parameters);
            if (result) {
                console.log("callStaticMethod ios  ", result);
            }
        } else {
            console.log(" JsNativeBridge callStaticMethod adroid ")
            let result = jsb.reflection.callStaticMethod(className, methodName, methodSignature, parameters)
            console.log("callStaticMethod result  ", result);
            if (result) {

                return result;
            }
        }
    }

    static createCanvas() {
        let canvas = document.createElement('canvas')
        console.log(' canvas ', canvas)
        return canvas;
    }

    static find(name: string, node) {
        return cc.find(name, node)
    }


    static getChildByIndex(node: cc.Node, index: number) {
        return node.children[index]
    }

    static findChild(name: string, node: cc.Node) {
        let temp = cc.find(name, node);
        if (temp) {
            return temp;
        } else {
            let count = node.children.length;
            for (let index = 0; index < count; index++) {
                const element = node.children[index];
                temp = this.findChild(name, element);
                if (temp) {
                    return temp;
                }
            }
            return null;
        }
    }

    static isValid(node: cc.Node) {
        return cc.isValid(node)
    }


    static getDefaultBundle() {
        return cc.resources
    }

    static loadRemote(url: string, callback: Function) {
        cc.assetManager.loadRemote(url, callback)
    }

    static loadBundle(url: string, callback: Function) {
        cc.assetManager.loadBundle(url, callback)
    }


    static getBundle(url: string) {
        return cc.assetManager.getBundle(url)
    }

    static loadScene(sceneName: string, func: Function) {
        cc.director.loadScene(sceneName, (error, scene: cc.Scene) => {
            func(error, scene)
        })
    }

    static runScene(scene: cc.Scene) {
        cc.director.runScene(scene)
    }

    static instantiate(res: any) {
        return cc.instantiate(res)
    }


    static getComponent(node: cc.Node, className: any): any {
        return node.getComponent(className)
    }

    static getChildByName(node: cc.Node, name: string): any {
        return node.getChildByName(name)
    }

    static getFrameSize() {
        return cc.view.getFrameSize();
    }

    static getVisibleSize() {
        return cc.view.getVisibleSize();
    }

    static getDesignSize() {
        return cc.Canvas.instance.designResolution;
    }

    static getDesignResolutionSize() {
        return cc.view.getDesignResolutionSize()
    }

    static frameAspectRatio() {
        let fs = this.getFrameSize()
        return fs.width / fs.height;
    }

    static designAspectRatio() {
        let ds = this.getDesignSize();
        return ds.width / ds.height;
    }

    static setNodeWH(node: cc.Node) {
        let size = this.getWH()
        var finalW = size.width;
        var finalH = size.height;
        node.width = finalW;
        node.height = finalH;
    }

    static getWH(): cc.Size {
        let dr = this.getDesignSize();
        // console.log(' dr ', dr)
        var s = this.getFrameSize()
        // console.log(' s ', s)
        var rw = s.width;
        var rh = s.height;
        var finalW = rw;
        var finalH = rh;

        if (this.frameAspectRatio() > this.designAspectRatio()) {
            //!#zh: 是否优先将设计分辨率高度撑满视图高度。 */
            //cvs.fitHeight = true;

            //如果更长，则用定高
            finalH = dr.height;
            finalW = finalH * rw / rh;
        }
        else {
            /*!#zh: 是否优先将设计分辨率宽度撑满视图宽度。 */
            //cvs.fitWidth = true;
            //如果更短，则用定宽
            finalW = dr.width;
            finalH = rh / rw * finalW;
        }
        return cc.size(finalW, finalH)
    }

    static resizeUI(config?: any) {
        let size = this.getWH()
        // let dr = this.getDesignSize();
        // // console.log(' dr ', dr)
        // var s = this.getFrameSize()
        // // console.log(' s ', s)
        // var rw = s.width;
        // var rh = s.height;
        var finalW = size.width;
        var finalH = size.height;
        cc.view.setDesignResolutionSize(finalW, finalH, cc.ResolutionPolicy.UNKNOWN);
        let cvs: cc.Canvas = cc.Canvas.instance
        cvs.node.width = finalW;
        cvs.node.height = finalH;
        // this.setNodeWH(cvs.node)
    }

    static get clientScaleX(){
        return 1;
    }

    static get clientScaleY(){
        return 1
    }



}



