import SdkEventList from "../../tools/SdkEventList";

export default class NativeAd {

    public adUnitId: string = ''
    public data: any = {}
    protected loadListener: SdkEventList = new SdkEventList()
    protected errorListener: SdkEventList = new SdkEventList()


    getAdUnitId() {
        return this.data['adUnitId'];
    }


    onLoad(func: Function) {
        this.loadListener.on(func)
    }

    offLoad(func: Function) {
        this.loadListener.off(func)
    }

    emitLoad(data) {
        this.loadListener.emit(data)
    }

    onError(func: Function) {
        this.errorListener.on(func)

    }

    offError(func: Function) {
        this.errorListener.off(func)
    }

    emitError(data) {
        this.errorListener.emit(data)
    }
}
