

export class GameEventName {
    static EVENT_FINISH: string = 'EVENT_FINISH'
    static EVENT_START: string = 'EVENT_START'
    static EVENT_END: string = 'EVENT_END'
    static EVENT_UPDATE: string = 'EVNET_UPDATE'
    static EVENT_CHECK: string = 'EVNET_CHECK'
    static EVENT_UI_VISIBLE: string = 'EVENT_UI_VISIBLE'
}

/**
 * 操作类型
 */
export enum OperateType {
    OPEN_GUIDE,//弹出教学
    OPEN_TIP,//弹出提示
    IN_VISIBLE,//设置节点不可见
    VISIBLE,//弹出对话。
    HIDE_UI,
    SHOW_UI,
    CLOSE_TIP,
    OPEN_DIALOG,

}
/**
 * 进入大厅
某个教学已完成
剩余弹出界面数量
等级是多少
某个教学未完成

 */
export enum EventCheckType {
    INTO_LAYER,//进入界面
    EVENT_FINISH,//某个事件已经结束
    LEFT_UI_COUNT,//剩余弹出界面的数量
    LEVEL_EQULE,
    GUIDE_NOT_FINISH,
    CHANGE_STATE,
    FOOD_FULL,
    TASK,
    BUILD,
    ENERGY,
    NEW_FOOD,
    MERGE_NEW_FOOD,
    FOOD_FRAZE,
    HAS_30093_NUM,
    NEW_FOOD_INTO_CHIKEN,
}



export enum EventCheckTime {
    INTO_LAYER,
}