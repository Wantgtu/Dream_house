
export default class SdkEventList {
    protected loadListener: Function[] = []
    on(func: Function) {
        let index = this.loadListener.indexOf(func)
        if (index < 0) {
            this.loadListener.push(func)
        }
    }
    off(func: Function) {
        let index = this.loadListener.indexOf(func)
        if (index >= 0) {
            this.loadListener.splice(index, 1)
        }
    }

    emit(data: any) {
        for (let index = 0; index < this.loadListener.length; index++) {
            const element = this.loadListener[index];
            element(data)
        }
    }
}
