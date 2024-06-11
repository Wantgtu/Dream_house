const Fs = require('fs');
var packagename = 'code_generator'
Editor.Panel.extend({

  style: Fs.readFileSync(Editor.url('packages://' + packagename + '/panel/index.css'), 'utf8'),

  template: Fs.readFileSync(Editor.url('packages://' + packagename + '/panel/index.html'), 'utf8'),

  ready() {
    const app = new window.Vue({
      el: this.shadowRoot,

      data() {
        return {
          prefab_path: '',
          export_path: '',
          TAG: '',
          LIST: '',
          SUPER_CLASS: '',
          NORMAL_COMP_LIST: "",
          isSaving: false,
        }
      },

      methods: {

        /**
         * 保存配置
         */
        saveConfig() {
          if (this.prefab_path == '' || this.export_path == '') {
            return;
          }
          if (this.isSaving) return;
          this.isSaving = true;

          const config = {
            prefab_path: this.prefab_path,
            export_path: this.export_path,
            TAG: this.TAG,
            LIST: this.LIST,
            SUPER_CLASS: this.SUPER_CLASS,
            NORMAL_COMP_LIST: this.NORMAL_COMP_LIST,
          };
          Editor.Ipc.sendToMain(packagename + ':save-config', config, () => {
            this.isSaving = false;
          });
        },

        /**
         * 读取配置
         */
        readConfig() {
          Editor.Ipc.sendToMain(packagename + ':read-config', (err, config) => {
            if (err || !config) return;
            for (const key in config) {
              this[key] = config[key];
            }
          });
        },
        onSelectPrefabPath() {

          let res = Editor.Dialog.openFile({
            title: "选择导出的配置目录",
            defaultPath: Editor.Project.path,
            properties: ['openFile', 'openDirectory','multiSelections'],
          });
          if (res !== -1) {
            let dir = res[0];
            dir = dir.replace(/\\/g, '/')
            let assets = '/assets/'
            let index = dir.indexOf(assets)
            if (index >= 0) {
              dir = dir.substring(index + assets.length)
            }
            if (dir !== this.prefab_path) {
              this.prefab_path = dir;
            }
          }
        },
        onSelectExportPath() {
          let res = Editor.Dialog.openFile({
            title: "选择导出的配置目录",
            defaultPath: Editor.Project.path,
            properties: ['openDirectory','promptToCreate '],
          });
          if (res !== -1) {
            let dir = res[0];
            dir = dir.replace(/\\/g, '/')
            let assets = '/assets/'
            let index = dir.indexOf(assets)
            if (index >= 0) {
              dir = dir.substring(index + assets.length)
            }
            if (dir !== this.export_path) {
              this.export_path = dir;
            }
          }
        },
      },

    });
    console.log('app redConfig ')
    app.readConfig();

  }

});