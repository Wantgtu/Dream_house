

export default class ButtonDuration {

    protected flag: boolean = false;

    canClick() {
        if (this.flag) {
            return false;
        }
        this.flag = true;
        setTimeout(() => {
            this.flag = false;
        }, 500);
        return true;

    }
}