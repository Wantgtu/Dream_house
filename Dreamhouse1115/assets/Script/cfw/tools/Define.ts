

export function isNull(obj: any) {
    return obj == undefined || obj == null;
}
export type HttpResultCallback = (msg: string, data: any) => void;

export let OPPSITE: number[] = [-1, 1, 1, -1]

export let OPPSITE_DIR: number[] = [1, 0, 3, 2]

/**
 * 方向枚举
 */
export enum DIR {
    LEFT,
    RIGHT,
    UP,
    DOWN,
    LEFT_UP,
    LEFT_DOWN,
    RIGHT_UP,
    RIGHT_DOWN,
    NONE,
}

export let MOVE_DIR: number[] = [-1, 1, 1, -1]


/**
 * 等于
 * 大于等于
 * 小于等于
 * 大于
 * 小于
 * 不等于
 */
export enum CompareSign {
    EQUAL,
    MORE_EQUAL,
    LESS_EQUAL,
    MORE,
    LESS,
    NOT_EQUAL
}

export function gameCompare(value: number, sign: CompareSign, num: number | string) {
    switch (sign) {
        case CompareSign.EQUAL:
            return value == num;
        case CompareSign.MORE_EQUAL:
            return value >= num;
        case CompareSign.MORE:
            return value > num;
        case CompareSign.LESS_EQUAL:
            return value <= num;
        case CompareSign.LESS:
            return value < num;
        case CompareSign.NOT_EQUAL:
            return value != num;
        default:
            return false;
    }
}

enum OrientationType {
    Portrait,
    Landscape,
};

