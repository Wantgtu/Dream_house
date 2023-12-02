import Base64 from "./Base64";
import { engine } from "../../engine/engine";
export default class StorageHelper {


    static get(key: string) {
        return engine.localStorage.getItem(key);
    }

    static getLength() {
        return engine.localStorage.getLength()
    }

    static set(key: string, value: string) {
        engine.localStorage.setItem(key, value);
    }

    static clear() {
        engine.localStorage.clear();
    }

    static remove(key: string) {
        engine.localStorage.removeItem(key);
    }

    static setJson(key: string, value: string) {
        this.set(key, JSON.stringify(value));
    }

    static getJson(key: string) {
        let value = this.get(key);
        if (!value) {
            return null;
        };
        return JSON.parse(value);
    }

    static getJsonBase64(key: string) {
        // console.log('getJsonBase64 key  ', key)
        let localValue = this.get(key);
        // console.log('getJsonBase64 localValue  ', localValue)
        if (!localValue) {
            return null;
        };
        let string = Base64.decode(localValue);
        // console.log('getJsonBase64 string  ', string)
        if (string) {
            try {
                let value = JSON.parse(string);
                return value;
            } catch (error) {
                console.log('getJsonBase64  error ', error)
                return null;
            }
        }

        return null;

    }
    static setJsonBase64(key: string, value: string) {
        // if(value){
        // console.log(' key ', key)
        value = JSON.stringify(value);
        // console.log('value = ', value)
        value = Base64.encode(value);
        // console.log('value 22222222222222222= ', value)
        this.set(key, value);
        // }

    }
    static setBase64(key: string, value: string) {
        this.set(key, Base64.encode(value));
    }
    static getBase64(key: string) {
        let localValue = this.get(key);
        if (!localValue) {
            return '';
        };
        let value = Base64.decode(localValue);
        return value;

    }
}
