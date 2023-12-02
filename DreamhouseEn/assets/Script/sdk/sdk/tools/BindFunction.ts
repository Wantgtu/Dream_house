

export default class BindFunction {
    private static ins: BindFunction

    static instance() {
        if (!this.ins) {
            this.ins = new BindFunction();
        }
        return this.ins;
    }
    protected funcList: { func: Function, target: any, id: Function }[] = []


    private getIndex(func: Function, target: any) {
        for (let index = 0; index < this.funcList.length; index++) {
            const element = this.funcList[index];
            if (element.func == func && element.target == target) {
                return index
            }
        }
        return -1;
    }

    getFunc(func: Function, target: any) {
        let index = this.getIndex(func, target)
        if (index >= 0) {
            let param = this.funcList[index]
            this.funcList.splice(index, 1)
            return param.id;
        } else {
            let id = func.bind(target)
            this.funcList.push({ func: func, target: target, id: id })
            return id;
        }
    }




}