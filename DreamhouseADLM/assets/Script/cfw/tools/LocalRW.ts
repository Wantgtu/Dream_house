import { StorageRW } from "../storage";
import StorageHelper from "./StorageHelper";



export default class LocalRW extends StorageRW {



    constructor() {
        super()
    }

    remove(key:string) {
        StorageHelper.remove(key)
    }

    getLength() {
        return StorageHelper.getLength()
    }

    read(key: string): void {
        try {
            let data = StorageHelper.getJsonBase64(key)
            this.emit(key, data)
        } catch (error) {
            this.emit(key, null)
        }
    }

    write(key: string, data: any, callback?: (state: number) => void): void {
        StorageHelper.setJsonBase64(key, data)
    }
}