import IRadioButton from "./IRadioButton";

export default class RadioButtonMgr {


    protected buttons: IRadioButton[] = []

    add(b: IRadioButton) {
        this.buttons.push(b)
    }

    setRadioButtonState(button: IRadioButton) {
        for (let index = 0; index < this.buttons.length; index++) {
            const element = this.buttons[index];
            if (element === button) {
                element.setRadioButtonState(true)
            } else {
                element.setRadioButtonState(false)
            }
        }
    }

}
