import { UIItem, UIType } from "../cfw/ui";


//ui分层
export enum UIIndex {
    ROOT,//最底层
    STACK,//堆栈管理
    QUEUE,//队列管理
    TOAST,//
    TOP,//永远不会清除的ui层
    AD_LAYER,
}

export let UI_CONFIG: UIItem[] = [
    { uiType: UIType.SINGLE, zIndex: 0, canPop: false },
    { uiType: UIType.STACK, zIndex: 10, canPop: true },
    { uiType: UIType.QUEUE, zIndex: 100, canPop: true },
    { uiType: UIType.STACK, zIndex: 200, canPop: false },
    { uiType: UIType.STACK, zIndex: 300, canPop: false },
    { uiType: UIType.STACK, zIndex: 400, canPop: true },
]