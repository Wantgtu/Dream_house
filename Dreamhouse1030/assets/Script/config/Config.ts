import Utils from "../cfw/tools/Utils";


// export let GAME_NAME: string = 'LoveAndHouse'

export class ResName {

    static WEAPON: string = 'Bow'

    static MAN: string = 'Man'

    static ITEM: string = 'Items'

    static DOOR: string = 'Door'

    // static TropicPack: string = 'TropicPack'

    // static Map: string = 'Map'
    static Map2: string = 'ScenaNapolje01'

    static Player: string = 'Dog1'

    static Player2: string = 'Dog2'

    static DressUp_Room: string = 'DressUp_Room'

    static DRAGON_TEXTURE: string = 'res/unity/prefab/LayaScene_DragonPrefab/%{platform}/Assets/Dragon/OldDragon/Texture/%{filename}'

    // static MAP_PAH = 'res/unity/LayaScene_TropicPack/%{platform}/%{filename}.ls'
    static DOOR_PREFAB = 'LayaScene_Door/%{platform}/%{filename}.lh'
    // static MAP_PAH = 'LayaScene_Map/%{platform}/%{filename}.lh'
    static MAP2_PAH = 'LayaScene_DogMap/%{platform}/%{filename}.lh'
    static ITEM_PREFAB = 'LayaScene_Items/%{platform}/%{filename}.lh'
    // static LOBBY_PATH = 'LayaScene_DogMap/%{platform}/%{filename}.lh'

    static WeaponPrefab = 'LayaScene_Bow/%{platform}/%{filename}.lh'

    static ManPrefab = 'LayaScene_Man/%{platform}/%{filename}.lh'

    static PlayerPrefab = 'LayaScene_Dog/%{platform}/%{filename}.lh'
    static Player2Prefab = 'LayaScene_Dog2/%{platform}/%{filename}.lh'
    static ENMEY_PATH = '%{moduleID}/%{platform}/%{filename}.lh'

    // static getPrefab(filename: string) {
    //     return Utils.replaceOpt(this.PREFABS, { platform: 'Conventional', filename: filename })
    // }

    // static getMap(filename: string) {
    //     return Utils.replaceOpt(this.MAP_PAH, { platform: 'Conventional', filename: filename })
    // }

    static getDressUpRoom() {
        let url = ResName.getRes(ResName.MAP2_PAH, ResName.DressUp_Room)
        return url;
    }

    static getMap() {
        let url = ResName.getRes(ResName.MAP2_PAH, ResName.Map2)
        return url;
    }

    static getPlayer() {
        let url3 = ResName.getRes(ResName.PlayerPrefab, ResName.Player)
        return url3;
    }

    static getPlayer2() {
        return ResName.getRes(ResName.Player2Prefab, ResName.Player2)
    }

    static getRes(path: string, filename: string) {
        return Utils.replaceOpt(path, { platform: 'Conventional', filename: filename })
    }

    static getResByModule(path: string, filename: string, moduleID: string) {
        return Utils.replaceOpt(path, { platform: 'Conventional', filename: filename, moduleID: moduleID })
    }
}


export let MAP_EDGE: number = 31;

export class EventName {
    static SELECT_FOOD = 'SELECT_FOOD'
    static DELETE_GRID_FOOD = 'DELETE_GRID_FOOD'
    static UPDATE_SPECIAL_TASK_TIME = 'UPDATE_SPECIAL_TASK_TIME'
    static CHANGE_SPECIAL_TASK_STATE = 'CHANGE_SPECIAL_TASK_STATE'
    static UPDATE_SPECIAL_TASK_STEP = 'UPDATE_SPECIAL_TASK_STEP'
    static UPDATE_SPECIAL_GOLD_NUM = 'UPDATE_SPECIAL_GOLD_NUM'
    static OPEN_BOX = 'OPEN_BOX'
    static ADD_FOOD_BY_GITF: string = 'ADD_FOOD_BY_GITF'
    static FOOD_FRAZE: string = 'FOOD_FRAZE'
    static OPEN_VIEW: string = 'OPEN_VIEW'
    static BUY_ITEM_FULL: string = 'BUY_ITEM_FULL'
    static MERGE_NEW_FOOD: string = 'MERGE_NEW_FOOD'
    static VIEW_SHOW: string = 'VIEW_SHOW'
    static NEW_BUILD_OPEN: string = 'NEW_BUILD_OPEN'
    static UPDATE_WEEKLY_STATE = 'UPDATE_WEEKLY_STATE'
    static ONLINE_LIGHT_EFFECT = 'ONLINE_LIGHT_EFFECT'
    static UPDATE_ONLINE_TIME: string = 'UPDATE_ONLINE_TIME'
    static UPDATE_ENERGY_TIMER: string = 'UPDATE_ENERGY_TIMER'
    static CHANGE_FOOD_STATE: string = 'CHANGE_FOOD_STATE'
    static TASK_OPEN: string = 'TASK_OPEN'
    static CLOSE_GAME_VIEW: string = 'CLOSE_GAME_VIEW'
    static UPDATE_BUILD_STATE: string = 'UPDATE_BUILD_STATE'
    static UPDATE_BUILD_COIN: string = 'UPDATE_BUILD_COIN'
    static UPDATE_TASK_STATE: string = 'UPDATE_TASK_STATE'
    static UPDATE_FOOD: string = 'UPDATE_FOOD'
    static UPDATE_FOOD_LIST: string = 'UPDATE_FOOD_LIST'
    static CHANGE_BUILD_IMG: string = 'CHANGE_BUILD_IMG'
    static INIT_FINISH: string = 'INIT_FINISH'
    static WC_WATER: string = 'WC_WATER'
    static BORN_FINISH: string = 'born_finish'
    static UPDATE_LEVEL: string = 'UPDATE_LEVEL'
    static UPDATE_EXP: string = 'UPDATE_EXP'
    static GAME_TIP: string = 'GAME_TIP'
    static UPDATE_ATTR_VALUE: string = 'UPDATE_ATTR_VALUE'
    static ADD_FOOD: string = 'ADD_FOOD'
    static CHANGE_GAME_STATE: string = 'CHANGE_GAME_STATE'
    static TOUCH_MOVE: string = 'touch_move'
    static TOUCH_END: string = 'touch_end'
    static TOUCH_START: string = 'touch_start'

    static SCREEN_START: string = 'SCREEN_START'
    static SCREEN_MOVE: string = 'SCREEN_MOVE'
    static SCREEN_END: string = 'SCREEN_END'



    static SHOOT: string = 'SHOOT'

    static ADD_GOLD: string = 'add_gold'

    static CHANGE_WEAPON: string = 'CHANGE_WEAPON'

    static CHANGE_SHOW_WEAPON: string = 'CHANGE_SHOW_WEAPON'

    static CHANGE_MAN: string = 'CHANGE_MAN'

    static UPDATE_USE_STATE: string = 'update_use_state'

    static UPDATE_DINO_STATE: string = 'update_dino_state'

    static UPDATE_KILL_COUNT: string = 'UPDATE_KILL_COUNT'

    static UPDATE_ARROW_NUM: string = 'UPDATE_ARROW_NUM'
    static UPDATE_ENMEY_NUM: string = 'UPDATE_ENMEY_NUM'

    static CHANGE_STATE: string = 'CHANGE_STATE'

    static SET_CAMERA: string = 'SET_CAMERA'

    static MOVE_PLANE: string = 'MOVE_PLANE'

    static GAME_PAUSE: string = 'GAME_PAUSE'
    static GAME_RESUME: string = "GAME_RESUME"


    static JOYSTICK_START: string = 'JOYSTICK_START'
    static JOYSTICK_END: string = 'JOYSTICK_END'
    static JOYSTICK_MOVE: string = 'JOYSTICK_MOVE'

    static SET_MAN: string = 'SET_MAN'

    static UPDATE_ITEM_NUM: string = 'update_item_num'
    static UPDATE_ITEM_NUM_FINISH: string = 'UPDATE_ITEM_NUM_FINISH'
    static CHANGE_CLOTHE_TYPE: string = 'CHANGE_CLOTHE_TYPE'

    static UPDATE_CLOTHE_STATE: string = 'UPDATE_CLOTHE_STATE'

    static CHANGE_PLAYER_STATE: string = 'CHANGE_PLAYER_STATE'

    // static SET_UI_VISIBLE: string = 'SET_UI_VISIBLE'
    static SET_SLEEP_STATE: string = 'SET_SLEEP_STATE'
    static WASH_SOAP: string = 'WASH_SOAP'
    static ADD_SOAP: string = 'ADD_SOAP'

    static ADD_HEART: string = 'ADD_HEART'
    static REMOVE_HEART: string = 'REMOVE_HEART'
    static WASH_CLEAR: string = 'WASH_CLEAR'

    static OPEN_FOOD_VIEW: string = 'OPEN_FOOD_VIEW'

    static DELETE_BUY_ITEM: string = 'DELETE_BUY_ITEM'

    static ADD_BUY_ITEM: string = 'ADD_BUY_ITEM'

    static UPDATE_FOOD_STATE: string = 'UPDATE_FOOD_STATE'

    static HIDE_CD_TIME: string = 'HIDE_CD_TIME'
    static SHOW_CD_TIME: string = 'SHOW_CD_TIME'
    static UPDATE_CD_TIME: string = 'UPDATE_CD_TIME'

    static DELETE_STORAGE_ITEM: string = 'DELETE_STORAGE_ITEM'

    static OPEN_MAKET: string = 'OPEN_MAKET'

    static SCENE_LANCH: string = 'SCENE_LANCH'
    static CHECK_REWARD: string = 'CHECK_REWARD'

    static CHANGE_COUNT: string = 'CHANGE_COUNT'

    static CHANGE_COST_COUNT: string = 'CHANGE_COST_COUNT'
    static ADD_BUY_PROP: string = 'ADD_BUY_PROP'
}
//龙的状态类型
export enum EnemyActionType {
    stand,
    move,
    none,
    attack,
    dead,
    win,
    escape,
    find,
    stop,
    walk,
    target,
    targetSpeed,
    back,
    enmey,
    trackEnemy,
    hit,


}
// export let PlayerActionName: string[] = [
//     'IdleFemale',
//     'IdleFemale',
//     'Sad Walk',
//     'Normal Walk',
//     'Catwalk',
//     'Pose',
//     'Dancing Maraschino Step',
//     'Cry',
//     'KissFemale',
//     'KissRejected',
//     'IdleFemale',
// ]
export enum PlayerActionType {
    born,
    stand,
    move,
    dressUp,
    WC0,
    WC1,
    WC2,
    WC3,
    idle,
    sleepStand,
    sleep,
    Play,
    Down,
    Down2,
    Down3,
    Wash,
    Wash2,
    eat1,
    eat2,
    swing1,
    swing2,
    WantPlay,
    WantEat,
    WantWash,
    WantSleep,
    Sleep4,




}

export let WASH_SOPE: string = 'Sundjer'

export let SLEEP_NUM: number = 20;
export let SLEEP_TIME: number = 3 * 60;
// export let ManActionName: string[] = [
//     'Male Breathing Idle',
//     'Male Breathing Idle',
//     'Male run 2',
//     'Kiss Guy',
//     'Male Dismiss',
//     'Male Blow Kiss',
//     'Male Angry',
//     'Male Disapoint',
//     'Male run 2',
// ]
export enum ManActionType {
    born,
    stand,
    move,
    KissGuy,
    MaleDismiss,
    MaleBlowKiss,
    MaleAngry,
    MaleDisapoint,
    moveTarget,
}
//游戏状态类型
export enum GameActionType {
    INIT,
    START,
    PLAYING,
    QUEST,
    OVER,
    WIN,
    FAIL,
    RECIVE,
    MAN_QUEST,
    FINAL,//最后的一段路程
    PLAY_GAME,
    WASH,
    EAT,
    QIU_QIAN,
    SLEEP,
    WC,
    DRESS,
    SMALL_GAME,
    BORN,

}
// export let FieldOfView: number[] = [
//     30,//backyardCamera
//     60,//BedroomCamera
//     30,//DressUpCamera
//     60,//FoodShopCamera
//     30,//KitchenCamera
//     40,//MainCamera
//     40,//PeeCamera
//     30,//ShowerCamera
//     30,//SpinTheWheelCamera
//     30,//SwingCamera
// ]
export enum CameraPos {
    backyardCamera,
    BedroomCamera,
    DressUpCamera,
    FoodShopCamera,
    KitchenCamera,
    MainCamera,
    PeeCamera,
    ShowerCamera,
    SpinTheWheelCamera,
    SwingCamera,
    Max
}
// export let PlayerPotition: string[] = [
//     'wcPosition',
//     'Krevetic',
//     'wcPosition',
//     'wcPosition',
//     'wcPosition',
//     'wcPosition',
//     'wcPosition',
//     'wcPosition',
//     'wcPosition',
//     'wcPosition',
// ]
//感知特征类型
/**
是否有树木
是否有敌人
敌人血量是否大于自己
是否有建筑物
是否有对象
是否有目标
是否到达目标位置
目标超过一定距离
是否有近距离的目标
是否在攻击范围内
是否被攻击了
是否离开巡视范围

 */
export enum PerceptionType {
    hasPoint,
    hasEnemy,
    isBlookLargerMe,
    hasBuild,
    hasObject,
    hasTarget,
    atTargetPos,
    isDisMoreThan,
    hasNearTarget,
    isInAttackRect,
    isHit,
    isOutRange,
    isAlive,
    isInEyeRange,
    isOutMap,

}
//对象类型
export class ObjectType {
    static DRAGON: number = 20;
    static TREE: number = 21
    static BUILD: number = 22;
    static PLAYER: number = 23;
    static ARROW: number = 24
}

//龙的攻击距离
export let RANGE: number = 5;
//龙的攻击范围
export let ANGLE: number = 30;
//龙的攻击间隔
export let ATK_DURATION: number = 1.5;
//龙的移动间隔
export let MOVE_DURATION: number = 0.3;
//龙的移动速度
export let DRAGON_SPEED: number = 5;
//龙的转身速度
export let ROTATION_SPD: number = 1;
//龙的血量
// export let DRAGON_BLOOD: number = 10000;

//塔的血量
// export let TOWER_BLOOD: number = 10000;
//树的血量
export let TREE_BLOOD: number = 100;
//树产生的金币数量
export let TREE_GOLD: number = 10;
//塔产生的金币数量
export let BUILD_GOLD: number = 20;

export let BUY_GOLD: number = 1000;

export let BUY_TOKEN: number = 25;

export enum ActionFinishType {
    animationFinish,
    duration,
    immediately,
    passiveFinish,
}

export let EXP_NUM: number = 10;

export let ENEMY_COUNT: number = 9;

export let ENERGY_NUM: number = 25;

export let INIT_DRAGON: number = 20001;

export let SCALE_STEP: number = 0.1

export let INIT_SCALE: number = 0.6;

export enum BattleType {
    CHI_JI,
    IO,
}


export class AudioID {
    // static BGM_LOBBY: string = 'audio/bgm1.mp3'
    static BGM_BATTLE1: string = 'res/audio/AmbientSoundUnderwater.mp3'
    // static BGM_BATTLE2: string = 'audio/dragonking.mp3'
    static CLICK2: string = 'res/audio/ButtonClick.mp3'

    static PULL: string = 'res/audio/Bow_Pull.mp3'

    static FIRE: string = 'res/audio/Bow_Fire.mp3'

    static Blood_Splatter = 'res/audio/Blood_Splatter_Audio.mp3'

    static Headshot = 'res/audio/Headshot.mp3'

    static levelComplete = 'res/audio/levelComplete.mp3'

    static levelFailed = 'res/audio/levelFailed.mp3'

}

export enum SoundID {
    MusicBg = 1,
    sfx_buttonPress,
    sfx_chatEnter,
    sfx_chatExit,
    sfx_episodeReward1,
    sfx_greenTick,
    sfx_windowClose,
    sfx_windowOpen,
    sfx_screenTap,
    sfx_collectItem,
    sfx_hitCloud_v01,
    sfx_winCoinCollectCashTill,
    collect_coin,
    DiamondCollect,
    sfx_blockerTreatBox,
    sfx_winCashTillAppear,
    sfx_winCashTillClose,


}

export let RANK_COLORS: string[] = [
    '#00ffff',
    '#ffff00',
    '#00ff00',
    '#ffffff',
]





export let ENEMY_NAME: string = 'EnemyItemView'
export let ENEMY_HEAD: string = 'head'
export let ARROW_NUM: number = 5;

export let ARROW_SPEED: number = 100

export let GAME_SPPED: number = 0.1;


export let GROUND: number = 0.1;

export let AIR_HIGH: number = 15;

export let ENMEY_MOVE_SPD: number = 2;


export let PLAYER_MOVE_SPD: number = 4;

export let ENMEY_RUN_SPD: number = 5;

export let PER_ENEY_GOLD: number = 50;

export let POS_MAP: { [key: string]: string } = {
    'posl1': 'posr1',
    'posr1': 'posl1',
    'posl2': 'posr2',
    'posr2': 'posl2',
    'posl3': 'posr3',
    'posr3': 'posl3',
}

export let POS_LIST: string[] = [
    'posr1',
    'posr2',
    'posr3'
]
export let defaultClothe: number[] = [
    20001,
    20014,
    20025,
    20036,
    20046,
    20062,
    20074,
    20088

]

export let posName: string[] = ['posBag', 'posHair', 'posJeans', 'posSkirt', 'posShoe', 'posNormal']
/**
0	帽子
1	裤子
2	上衣
3	毛色
4	鞋子
5	眼镜
6	套装
7	眼睛

 */
export enum ClotheType {
    Cap,//装饰
    Trousers,
    Jacket,
    Skin,
    Shose,
    Glasses,
    Suit,
    Eye,
    Max,
}
export let ClotheActionType: PlayerActionType[] = [
    PlayerActionType.idle,
    PlayerActionType.dressUp,
    PlayerActionType.dressUp,
    PlayerActionType.dressUp,
    PlayerActionType.dressUp,
    PlayerActionType.idle,
    PlayerActionType.dressUp,
    PlayerActionType.idle,
]

export let ATTR_STEP: number = 1;
export let ATTR_MAX: number = 100;
export let ATTR_TIME_STEP: number = 3;
export enum PlayerAttrType {
    EAT,
    WASH,
    SLEEP,
    WC,
    PLAY,
    MAX,
}

export enum PropType {
    GROUND,
    DOOR,
    SINGLE,
    KEY,
    MOVE_PROP,
}

export class ItemType {
    static GOLD: number = 10
    static CLOTHE: number = 20;
    static KEY: number = 16
    static TOKEN: number = 13;
    static FOOD: number = 30;
    static ENERGY: number = 19;
    static EXP: number = 14;
    static CARD: number = 17;
}
/**
10001	金币
11001	广告
12001	等级
13001	钻石
14001	经验
15001	技能点
16001	钥匙
 */
export class ItemID {
    static KEY = 16001
    static AD = 11001
    static SHARE = 18001
    static GOLD = 10001
    static TOKEN = 13001
    static SCRATCH_CARD = 17001
    static ENERGY = 19001
    static LEVEL = 20001;
    static EXP = 14001
}

export enum TouchType {
    SHOP,
    GAME,
    SLOT,
    SCRATCH_CARD,
    MAX,
}


// export let RATIO_NUM: number = 3;

export let RATIO_NUM: number[] = [2, 3, 4, 5]


export let MAX_CLOTHE_VALUE: number = 32;

export let GOLD_NUM: number = 1000;

export let ENRGY_NUM: number = 100

export let ENRGY_NUM2: number = 25;

export class UI_TYPE {
    static SLOT: number = 1;
    static SCRATCH_CARD: number = 2
    static BOX: number = 3;
}

export let KEY_MAX: number = 3;

export let TreeList: string[] = [
    'Holidays1',
    'Holidays2',
    'Holidays3',
    'Island1',
    'Island2',
    'Island3',
    'Island4',
    'Island5',
    'Island6',
]

export let stepPoints: number[] = [1, 2, 3, 4, 5]

export enum FoodType {
    bee,
    beeHouse,
    book,
    bread,
    cake1,
    cake2,
    catHouse,
    cat,
    cion,
    coolDrink,
    ennergy,
    saizi,
    token,
    bag,
    sucai,
    hotDrink,
    box,
    bookBox,
    clothe,
    kaoxiang,
    qiqiu,
    yanhui,
    pisa,
    sala,
    sanmingzhi,
    bookGui,
    teeGui,
    fengmi,
    gift,
    partygift,
    choicechest,
    shop_gift,
    max,
}

export enum FoodOutType {
    NO_OUT,//不产出

    OUT_RANDOM_AND_CD,//正常随机产出带cd

    OUT_RANDOM_COUNT_DESTROY,//随机产出一定数量然后消失

    OUT_ITEM_DESTORY,//产出给定道具后消失

    OUT_ITEM_WITH_OPEN_CD,//产出给定数量后消失，但是有开启cd

    CHOICE_ITEM,//选择一个产出

    OUT_COST_ITEM,//产出消耗道具


}

export let DEFAUL_GOLG: number = 30063;
export let WEEKLY_RATIO: number = 2;
export let ENERGY_TIME = 120;
export let ENERGY_MAX = 100;

export enum RedTipType {
    HAS_TASK,
    HAS_REWARD,
    STORE,
    BUILD_OPEN,
    ONLINE,
    DAILY_TASK,
    LUCKY_SPIN,
    BOX_POP,
    SPECIAL_TASK,
    HAS_RECORDER,
    EGG_OPEN,
    IN_MARKET,

}

export enum FoodHasState {
    NONE,
    HAS,
    FULL,
}
/**
1	大掌柜
2	建造师
3	购物狂
4	广告达人
5	天天向上
6	小菜一碟
7	孜孜不倦
8	家财万贯
9	财大气粗
10	游戏达人

 */
export enum DailyTaskID {
    ONE = 1,
    BUILD,
    BUY,
    AD,
    LEVEL,
    TASK,
    ENERGY,
    GOLD,
    GIFT,
    GAME_DA_REN,

}

export enum PersonState {
    BOEN,
    STAND,
    TIP,
    OUT,

}

export let VEDIO_ENERGY: number = 25;

export let VEDIO_TOKEN: number = 20;

export let SPECIAL_TASK_OK: boolean = true

//消耗能量个数
export let FREE_EGG_COUNT: number = 5;
//砸蛋开启等级
export let EGG_OPEN_LEVEL: number = 3;
//幸运转盘开启等级
export let LUCKY_SPIN_OPEN_LEVEL: number = 5;
//随机宝箱开启等级
export let RANDOM_BOX_OPEN_LEVEL: number = 8;

export let FRAME_DURATION: number = Math.floor(1 / 60 * 100) / 100;