import { BaseItemView } from "../../../cfw/view";


export default abstract class MarketItemView extends BaseItemView {


    content() {
        this.updateFood();
        this.updateCost();
        this.updateCount();
    }
    abstract updateFood(): void;
    abstract updateCost(): void;
    abstract updateCount(): void
}