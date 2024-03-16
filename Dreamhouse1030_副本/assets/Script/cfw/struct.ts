export class LinkList<T>{


    private first: LinkNode<T>;
    private end: LinkNode<T>;


    private count: number = 0;

    push(obj: T) {
        let node = new LinkNode<T>();
        this.count++;
        node.setObj(obj)
        node.setPre(this.end)
        if (!this.first) {
            this.first = node;
        }
        if (this.end) {
            this.end.setNext(node)
        }
        this.end = node;
    }

    size() {
        return this.count;
    }


    getFirt() {
        return this.first
    }

    getEnd() {
        return this.end
    }

}

export class LinkNode<T> {
    protected pre: LinkNode<T>;
    protected next: LinkNode<T>;
    protected obj: T;
    setPre(pre: any) {
        this.pre = pre;
    }

    getPre() {
        return this.pre;
    }

    setNext(n: any) {
        this.next = n;
    }

    getNext() {
        return this.next;
    }

    setObj(obj: any) {
        this.obj = obj;
    }

    getObj() {
        return this.obj;
    }
}

export class MapList<K, T>{

    protected list: T[] = []

    protected map: TSMap<K, T> = new TSMap();

    /**
     * 直接插入数据 通过map加速判断是否存在的操作
     * @param key 
     * @param v 
     */
    push(key: any, v: T) {
        let has = this.has(key)
        if (!has) {
            this.list.push(v)
            this.map.set(key, v)
        }
    }


    /**
     * 使用插入排序方法插入数据，通过map加速判断是否存在的操作
     * @param key 
     * @param v 
     * @param func 
     */
    insert(key: any, v: T, func: (a: T, b: T) => boolean) {
        if (this.list.length == 0) {
            this.list.push(v)
            this.map.set(key, v)
        } else {
            let has = this.has(key)
            if (!has) {
                let last: T = this.list[this.length - 1]
                if (func(v, last)) { // 
                    this.list.push(v)
                    this.map.set(key, v)
                } else {
                    for (let index = 0; index < this.list.length; index++) {
                        const element = this.list[index];
                        if (!func(v, element)) {
                            this.list.splice(index, 0, v)
                            this.map.set(key, v)
                            break;
                        }
                    }
                }
            }

        }
    }


    getByIndex(index: number) {
        return this.list[index]
    }

    get length() {
        return this.list.length;
    }

    /**
     * ts语言自带的排序方式
     * @param func 
     */
    sort(func: (a: any, b: any) => number) {
        return this.list.sort(func)
    }

    getList() {
        return this.list
    }

    getMap() {
        return this.map;
    }

    /**
     * 是否存在某个key
     * @param key 
     */
    has(key: string | number) {
        return this.map.has(key)
    }

    getByKey(key: K) {
        return this.map.get(key)
    }

    remove(key: K, obj: T) {
        let index = this.list.indexOf(obj)
        if (index >= 0) {
            this.list.splice(index, 1)
            this.map.delete(key)
        }
    }

}

export class TSMap<K, T> {
    private value: { [k: string]: any } = {};
    private count: number;
    public constructor() {
        this.init();
    }
    private init() {
        this.value = {};
        this.count = 0;
    }
    public get values() {
        return this.value;
    }

	/**
	 * 如果对象实现了Cloneable接口 会调用克隆函数返回副本
	 * 否则返回对象本身。
	 */
    getArray(): T[] {
        let array: T[] = [];
        for (const key in this.value) {
            if (this.value.hasOwnProperty(key)) {
                const element = this.value[key];
                // if (element.clone) {
                // 	array.push(element.clone());
                // } else {
                array.push(element);
                // }

            }

        }
        return array;
    }

    forEach(func: (key: string, value: T) => void) {
        for (const key in this.value) {
            if (this.value.hasOwnProperty(key)) {
                func(key, this.value[key]);
            }
        }
    }

    keySet(): string[] {
        let array = [];
        for (const key in this.value) {
            array.push(key);
        }
        return array;
    }

    public set(key: any, value: any) {
        key = "" + key;
        if (!this.has(key)) {
            this.count++;
        }
        this.value[key] = value;
    }

    public put(key: any, value: T) {
        key = "" + key;
        this.set(key, value);
    }
    public has(key: any) {
        key = "" + key;
        return this.value[key] != null && this.value[key] != undefined;
    }
    public get(key: any): T {
        key = "" + key;
        return this.value[key];
    }

    remove(key: string): T {
        key = "" + key;
        return this.delete(key);
    }

    public delete(key: any): T {
        key = "" + key;
        let value = this.value[key]
        this.value[key] = null;
        delete this.value[key];
        this.count--;
        return value;
    }
    public release() {
        for (let key in this.value) {
            this.value[key].release();
        }
    }
    public size(): number {
        return this.count;
    }
    public clear() {
        for (let key in this.value) {
            this.delete(key);
        }

    }

    //tsMap合并 相同key替换
    public add(map: TSMap<K, T>) {
        map.forEach((value, key) => {
            this.set(key, value);
        })
    }

}


export class TSTree<T>{


    private parent: TSTree<T>;

    private children: TSTree<T>[] = []

    private data: T;

    setData(d: T) {
        this.data = d;
    }

    getData() {
        return this.data;
    }

    putChild(index: number, child: TSTree<T>) {
        this.children[index] = child;
    }

    addChild(node: TSTree<T>) {
        this.children.push(node)
    }

    getChildren() {
        return this.children;
    }



}