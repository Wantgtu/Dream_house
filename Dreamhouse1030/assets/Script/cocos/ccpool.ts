
export class CCNodePool {

    private pool: cc.NodePool;

    private name: string = ''

    constructor() {
        this.pool = new cc.NodePool();
    }

    /**
     * 
     * @param prefab 预制体
     * @param conut 初始化个数
     */
    init(name: string, func: () => any, conut: number) {
        this.name = name
        for (let i = 0; i < conut; i++) {
            let obj: cc.Node = func(); // 创建节点
            this.put(obj); // 通过 putInPool 接口放入对象池
        }
    }

    getName() {
        return this.name
    }

    get(func: () => any) {
        let go: cc.Node = this.pool.size() > 0 ? this.pool.get() : func();
        return go;
    }

    size() {
        return this.pool.size();
    }

    put(go: cc.Node) {
        this.pool.put(go);
    }

    clear() {
        this.pool.clear();
    }

}

/**
 * 使用opacity方式隐藏对象
 */
export class SelfPool {

    private list: cc.Node[] = []

    private pool: CCNodePool;

    constructor(pool: CCNodePool) {
        this.pool = pool;
    }

    init(key: string, func: () => any, count: number): void {
        for (let index = 0; index < count; index++) {
            this.put(this.get(func))
        }
    }

    get(func: () => any) {
        let go: cc.Node = this.list.length > 0 ? this.list.shift() : this.pool.get(func);
        go.opacity = 255;
        return go;
    }

    getPool() {
        return this.pool
    }

    size() {
        return this.pool.size() + this.list.length;
    }

    /**
     * 
     * @param go 
     * @param nodePool 是否放入NodePool中
     */
    put(go: cc.Node, nodePool: boolean = false) {
        if (nodePool) {
            this.pool.put(go)
        } else {
            this.list.push(go);
            go.stopAllActions();
            go.opacity = 0;
        }

    }

    clear() {
        this.pool.clear();
        this.list.length = 0;
    }
}

export class CCPoolManager {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }

    //对象池表
    private pools = {};
    // 对象名称 和给定 key的 映射表 这样在回收对象的时候就不需要传入key了。通过节点的name就可以找到key。
    private nameMap = {};

    init(key: string, func: () => any, count: number, useOpacity: boolean = false) {

        this.create(key, useOpacity)
        this.pools[key].init(key, func, count)

    }

    private create(key: string, useOpacity: boolean = false) {
        if (!this.pools[key]) {
            if (useOpacity) {
                this.pools[key] = new SelfPool(new CCNodePool())
            } else {
                this.pools[key] = new CCNodePool()
            }
        }
    }

    size(key: string) {
        let pool = this.pools[key];
        if (pool) {
            return pool.size();
        }
        return 0
    }

    getPool(key: string) {
        return this.pools[key].getPool();
    }

    get(key: string, func: () => any): cc.Node {
        this.create(key)
        if (this.pools[key]) {
            let go: cc.Node = this.pools[key].get(func);
            if (!this.nameMap[go.name] && go.name != key) {
                this.nameMap[go.name] = key;
            }
            return go;
        }
        return null;
    }


    put(go: cc.Node, nodePool: boolean = false) {

        let key = this.nameMap[go.name];

        if (!key) {
            key = go.name;
        }

        if (!this.pools[key]) {
            cc.warn(" not have  name ", key, ' ,go.name ', go.name);
            return;
        }
        this.pools[key].put(go, nodePool);
    }

    clear(name: string) {
        if (this.pools[name]) {
            this.pools[name].clear();
            this.pools[name] = null;
        }
    }
    clealAll() {
        for (const key in this.pools) {
            this.clear(key);
        }
        this.pools = {};
    }
}