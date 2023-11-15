export class PropertyAddType {

    public static ADDTYPE_VALUE: number = 0; // 数值类型
    public static ADDTYPE_RATE: number = 1; // 乘积系数类型	
    public static ADDTYPE_MULTIPLY: number = 2//所有数值相乘
}

export class ValueType {
    static MIN = 0;
    static MAX = 1;
}

export enum AttrType {
    HP,//（血量无法提升，为固定值，每个恐龙的血量不同，没有防御值设定）
    POWER,//【1伤害扣敌人1点血量】
    HEAL_POINT,//【1回复代表吃一个人回复1点血】
    ATK_CD,//【每秒可攻击x下】
    JUMP_POWER,//跳跃力 【基于原本的跳跃高度】
    SKILL,//【1伤害扣敌人1点血量】
    MOVE_SPEED,//移动速度
    RUN_SPEED,//跑动速度
    EXTRA,//附加值
    MAX,
}

let VALUE_TYPE_LIST: number[] = [
    ValueType.MAX,
    ValueType.MIN,
    ValueType.MIN,
    ValueType.MIN,
    ValueType.MIN,
    ValueType.MIN,
    ValueType.MIN,
    ValueType.MIN,
    ValueType.MIN,
]

export class PropertyAddedValue {
    // 属性值
    private finalValue: number = 0;
    public constructor(valueType: PropertyAddType) {
        this.addType = valueType;
        if (this.addType == PropertyAddType.ADDTYPE_MULTIPLY) {
            this.finalValue = 1;
        } else {
            this.finalValue = 0;
        }
    }
    // 属性类型
    private addType: PropertyAddType;


    public AddType() {
        return this.addType;
    }



    public add(addedValue: number) {
        if (this.addType == PropertyAddType.ADDTYPE_MULTIPLY) {
            this.finalValue *= addedValue;
        } else {
            this.finalValue += addedValue;
        }

    }

    public remove(removeValue: number) {
        // this.finalValue -= removeValue;
        if (this.addType == PropertyAddType.ADDTYPE_MULTIPLY) {
            this.finalValue /= removeValue;
        } else {
            this.finalValue -= removeValue;
        }
    }
    public getValue() {
        return this.finalValue;
    }
}
export class AttrInfo {


    private type: ValueType;

    private level: number = 0;
    //最总值
    private propFinalValue: number = 0;
    //基础值
    private propBaseValue: number = 0;
    // 最大值
    private maxValue: number = 0;

    //相加的数值
    private addedValue: PropertyAddedValue = new PropertyAddedValue(PropertyAddType.ADDTYPE_VALUE)

    private addedRate: PropertyAddedValue = new PropertyAddedValue(PropertyAddType.ADDTYPE_RATE)

    private addedMultiply: PropertyAddedValue = new PropertyAddedValue(PropertyAddType.ADDTYPE_MULTIPLY)

    constructor(type: ValueType) {
        this.type = type;
    }

    setLevel(lv: number) {
        this.level = lv;
    }

    getLevel() {
        return this.level;
    }

    public getPropValue(): number {
        return this.propFinalValue;
    }
    /**
     * 设置某个基础属性值
     * @param type 
     * @param value 
     * @param update 是否更新最终值
     */
    public setBasePropValue(value: number) {
        this.propBaseValue = value;
        this.maxValue = value;
        this.propFinalValue = this.propBaseValue
    }

    getMaxValue() {
        return this.maxValue;
    }
    getRatioValue() {
        let cur: number = this.propFinalValue
        let total: number = this.maxValue
        let value = 1;
        if (total > 0) {
            value = cur / total
        }
        return value * 100;
    }

    public changePropValue(propType: PropertyAddType, value: number) {
        if (propType == PropertyAddType.ADDTYPE_VALUE) {
            this.propBaseValue += value;
        } else if (propType == PropertyAddType.ADDTYPE_RATE) {
            this.propBaseValue += Math.ceil(this.maxValue * value);
        } else {
            this.propBaseValue *= this.maxValue * value;
        }
        // this.totalValueList[type] = this.propBaseValueList[type]
        if (this.type == ValueType.MAX) {
            if (this.propBaseValue > this.maxValue) {
                this.propBaseValue = this.maxValue
            }
        } else {
            if (this.propBaseValue > this.maxValue) {
                this.maxValue = this.propBaseValue
            }
        }
        // if (update) {
        this.updateFinalValue();
        // }

    }
    /**
     * 更新某个属性的最终值
     * @param type 属性类型
     */
    private updateFinalValue() {
        this.propFinalValue = this.propBaseValue
        this.propFinalValue += this.addedValue.getValue();
        let addNum = this.propFinalValue * this.addedRate.getValue();
        this.propFinalValue += addNum
        this.propFinalValue *= this.addedMultiply.getValue()
        if (this.propFinalValue < 0) {
            this.propFinalValue = 0
        }
        // logInfo(' updateFinalValue ', this.propFinalValue)
    }

    getPropertyAddedValue(addType: PropertyAddType) {
        let propertyAddedValue: PropertyAddedValue = null;

        if (addType == PropertyAddType.ADDTYPE_VALUE) {
            propertyAddedValue = this.addedValue;

        }
        else if (addType == PropertyAddType.ADDTYPE_RATE) {
            propertyAddedValue = this.addedRate;

        } else {
            propertyAddedValue = this.addedMultiply;

        }
        return propertyAddedValue;
    }
    /**
     * 为某个属性添加数值
     * @param type 属性类型
     * @param addType 是增减 还是倍率
     * @param value 负号为减
     */
    public addValue(addType: PropertyAddType, value: number) {

        // console.log("addValue  AddValue type is " + type + " addType " + addType + " value " + value);
        let propertyAddedValue: PropertyAddedValue = this.getPropertyAddedValue(addType)

        propertyAddedValue.add(value)
        this.updateFinalValue()

    }

    /**
     * 移除效果的附加值
     * @param type 
     * @param addType 
     * @param value 
     */
    public removeValue(addType: PropertyAddType, value: number) {
        // console.log("removeValue  AddValue type is " + type + " addType " + addType + " value " + value);
        let propertyAddedValue: PropertyAddedValue = this.getPropertyAddedValue(addType);
        propertyAddedValue.remove(value);
        this.updateFinalValue();
    }
}
export class AttrManager {

    private attrMap: AttrInfo[] = []

    public constructor() {
        this.initialize();
    }

    getAttribute(type: AttrType) {
        return this.attrMap[type]
    }

    setLevel(type: AttrType, lv: number) {
        if (this.attrMap[type]) {
            this.attrMap[type].setLevel(lv)
        }
    }

    getLevel(type: AttrType) {
        return this.attrMap[type].getLevel()
    }


    getMaxValue(t: AttrType) {
        return this.attrMap[t].getMaxValue()
    }

    getRatioValue(type: AttrType) {
        if (this.attrMap[type]) {
            return this.attrMap[type].getRatioValue()
        }
        return 0;
    }
    /**
     * 直接添加到基础属性中，比如一些一次性的效果 如加血道具。
     * 这些添加的数值是不会消失的。
     * @param type 
     * @param value 
     * @param update 是否更新最终值
     */
    public changePropValue(type: AttrType, propType: PropertyAddType, value: number) {
        if (this.attrMap[type]) {
            this.attrMap[type].changePropValue(propType, value)
        }
    }
    /**
     * 设置某个基础属性值
     * @param type 
     * @param value 
     * @param update 是否更新最终值
     */
    public setBasePropValue(type: AttrType, value: number) {
        if (this.attrMap[type]) {
            this.attrMap[type].setBasePropValue(value)
        }
    }

    //初始化
    initialize() {
        for (let i = 0; i < AttrType.MAX; i++) {
            this.attrMap[i] = new AttrInfo(VALUE_TYPE_LIST[i]);
        }
    }

	/**
	 * 得到内部最终的属性值
	 */
    public getPropValue(propType: AttrType): number {
        if (this.attrMap[propType])
            return this.attrMap[propType].getPropValue()
        else {
            return 0;
        }
    }



    /**
     * 添加buff
     * @param type 
     * @param addType 
     * @param value 
     */
    public addValue(type: AttrType, addType: PropertyAddType, value: number) {
        if (this.attrMap[type]) {
            this.attrMap[type].addValue(addType, value)
        }
    }

    /**
     * 移除buff
     * @param type 
     * @param addType 
     * @param value 
     */
    public removeValue(type: AttrType, addType: PropertyAddType, value: number) {
        if (this.attrMap[type]) {
            this.attrMap[type].removeValue(addType, value)
        }
    }
}
