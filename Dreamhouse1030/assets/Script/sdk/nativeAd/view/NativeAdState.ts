import SDKManager from "../../sdk/SDKManager";


const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
export default class NativeAdState extends cc.Component {
    onLoad() {
        this.node.active = SDKManager.getChannel().hasNativeAd()
    }
}