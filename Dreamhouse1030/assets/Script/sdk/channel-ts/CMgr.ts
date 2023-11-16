

import DevHelper from "./DevHelper";
import QQHelper from "./QQHelper";
import BaseHelper from "./BaseHelper";
import VivoHelper from "./VivoHelper";
import WXHelper from "./WXHelper";
import OppoHelper from "./OppoHelper";
import { ChannelID } from "../sdk/SDKConfig";
import TTHelper from "./TTHelper";
import F399Helper from "./F399Helper";
import KSHelper from "./KSHelper";
import MiMoHelper from "./MiMoHelper";


/**
 * ChannelManager
 */
export default class CMgr {


    private static h: BaseHelper;


    static get helper() {
        return this.h;
    }

    static setHelper(id: string) {
        let helper: BaseHelper = null;
        let channelID: string = id
        // console.log(' getChannel id ', id, channelID)
        switch (channelID) {
            case ChannelID.QQ:
                helper = new QQHelper()
                break;
            case ChannelID.VIVO:
                helper = new VivoHelper()
                break;
            case ChannelID.WX:
                helper = new WXHelper()
                break;
            case ChannelID.OPPO:
                helper = new OppoHelper()
                break;
            case ChannelID.TT:
                helper = new TTHelper()
                break;
            case ChannelID.F399:
                helper = new F399Helper()
                break;
            case ChannelID.KS:
                helper = new KSHelper()
                break;
            case ChannelID.MIMO:
                helper = new MiMoHelper()
                break;
            default:
                helper = new DevHelper()
                break;
        }
        this.h = helper;
    }
}