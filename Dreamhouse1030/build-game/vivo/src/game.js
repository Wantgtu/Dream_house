import uma from '../umtrack-quickgame';
console.log("友盟统计接入")
uma.init({
    appKey: '647ffbcea1a164591b2c5991',
    useOpenid: false, // default true
    autoGetOpenid: false,
    debug: true
});
require("src/boot.js");