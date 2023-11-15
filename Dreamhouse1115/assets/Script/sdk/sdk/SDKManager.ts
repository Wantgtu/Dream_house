import BaseChannel from "./base/BaseChannel";
import { ChannelID, getChannelID } from "./SDKConfig";
import WXChannel from "./wx/WXChannel";
import OppoChannel from "./oppo/OppoChannel";
import QQChannel from "./qq/QQChannel";
import VivoChannel from "./vivo/VivoChannel";
import TTChannel from "./tt/TTChannel";
import SwanChannel from "./swan/SwanChannel";
import DevChannel from "./dev/DevChannel";
import CocosChannel from "./cocos/CocosChannel";
import CSJChannel from "./csj/CSJChannel";
import GoogleChannel from "./google/GoogleChannel";
import { G4399Channel } from "./4399/G4399Channel";
import KwaiChannel from "./kwai/KwaiChannel";
import ViGooChannel from "./vigoo/ViGooChannel";
import QQChannel2 from "./qq/QQChannel2";
import KSChannel from "./ks/KSChannel";
import MiMoChannel from "./mimo/MiMoChannel";

export default class SDKManager {

    protected channel: BaseChannel = null;

    static channel: BaseChannel;
    static getChannel() {
        return this.channel;
    }

    static init(id: string, cfg: any) {
        let channelID: string = getChannelID(id)

        console.log(' Google init channel id ', id, channelID)
        let c = cfg[channelID];
        console.log(' c ', c)
        switch (channelID) {
            case ChannelID.WX:
                this.channel = new WXChannel(c)
                break;
            case ChannelID.SWAN:
                this.channel = new SwanChannel(c)
                break;
            case ChannelID.TT:
                this.channel = new TTChannel(c)
                break;
            case ChannelID.VIVO:
                this.channel = new VivoChannel(c)
                break;
            case ChannelID.OPPO:
                this.channel = new OppoChannel(c)
                break;
            case ChannelID.QQ:
                this.channel = new QQChannel2(c)
                break;
            case ChannelID.COCOS:
                this.channel = new CocosChannel(c)
                break;
            case ChannelID.CSJ:
                this.channel = new CSJChannel(c)
                break;
            case ChannelID.GOOGLE_ADMOB:
                this.channel = new GoogleChannel(c)
                break;
            case ChannelID.F399:
                this.channel = new G4399Channel(c)
                break;
            case ChannelID.KWAI:
                this.channel = new KwaiChannel(c)
                break;
            case ChannelID.VIGOO:
                this.channel = new ViGooChannel(c)
                break;
            case ChannelID.KS:
                this.channel = new KSChannel(c)
                break;
            case ChannelID.MIMO:
                this.channel = new MiMoChannel(c)
                break;
            default:
                this.channel = new DevChannel(c)
                break;
        }

    }




}
