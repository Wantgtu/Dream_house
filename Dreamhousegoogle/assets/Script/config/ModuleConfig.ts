//模块id
export class ModuleID {
    static RES = 'res';//resource 首包资源
    static PUBLIC = 'public';//公共模块
    static LOGIN = 'login';//登陆模块
    static GAME = 'game'
    static LOBBY = 'lobby';//大厅模块
    // static PET = 'cat'//宠物模块
    static AUDIO = 'audio'
    static LOADING = 'loading'
    static START = 'start'

    static BUILD1 = 'build1'
    static BUILD2 = 'build2'
    static BUILD3 = 'build3'
    static BUILD4 = 'build4'
    static BUILD5 = 'build5'
    static BUILD6 = 'build6'

    static nativeAd = 'nativeAd'

    static CRAZY_CLICK = 'crazyClick'

    static install = 'install'


}

//有分包的模块就有bundle的名字，没有就是使用cc.resource 

export let ModuleConfig = [
    { name: ModuleID.RES, isBundle: false, bundleName: '' },
    //public
    { name: ModuleID.PUBLIC, isBundle: true, bundleName: ModuleID.PUBLIC },
    //login
    { name: ModuleID.LOGIN, isBundle: false, bundleName: '' },
    //lobby
    { name: ModuleID.LOBBY, isBundle: false, bundleName: '' },
    // { name: ModuleID.PET, isBundle: false, bundleName: 'cat' },
    { name: ModuleID.GAME, isBundle: true, bundleName: ModuleID.GAME },

    { name: ModuleID.AUDIO, isBundle: true, bundleName: ModuleID.AUDIO },

    { name: ModuleID.LOADING, isBundle: false, bundleName: '' },

    { name: ModuleID.BUILD1, isBundle: true, bundleName: ModuleID.BUILD1 },
    { name: ModuleID.BUILD2, isBundle: true, bundleName: ModuleID.BUILD2 },
    { name: ModuleID.BUILD3, isBundle: true, bundleName: ModuleID.BUILD3 },
    { name: ModuleID.BUILD4, isBundle: true, bundleName: ModuleID.BUILD4 },
    { name: ModuleID.BUILD5, isBundle: true, bundleName: ModuleID.BUILD5 },
    { name: ModuleID.BUILD6, isBundle: true, bundleName: ModuleID.BUILD6 },
    { name: ModuleID.START, isBundle: true, bundleName: ModuleID.START },

    { name: ModuleID.nativeAd, isBundle: true, bundleName: ModuleID.nativeAd },
    { name: ModuleID.CRAZY_CLICK, isBundle: true, bundleName: ModuleID.CRAZY_CLICK },
    { name: ModuleID.install, isBundle: true, bundleName: ModuleID.install },
]