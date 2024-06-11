"use strict";
import uma from './uma.min.js';

uma.init({
  appKey: '61f3cc8ae014255fcb0de31f',
  useOpenid: false, // default true
  autoGetOpenid: false,
  debug: true
});
require('adapter-min.js');

__globalAdapter.init();

require('cocos/cocos2d-js-min.js');

__globalAdapter.adaptEngine();

require('./ccRequire');

require('./src/settings'); // Introduce Cocos Service here


require('./main'); // TODO: move to common
// Adjust devicePixelRatio


cc.view._maxPixelRatio = 4;

if (cc.sys.platform !== cc.sys.WECHAT_GAME_SUB) {
  // Release Image objects after uploaded gl texture
  cc.macro.CLEANUP_IMAGE_CACHE = true;
}

window.boot();