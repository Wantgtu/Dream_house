import { BaseView } from "../../../cfw/view";
import DailyTaskMgr from "../model/DailyTaskMgr";
import DailyTaskItemView from "./DailyTaskItemView";
import DailyTaskItemModel from "../model/DailyTaskItemModel";
import GridLayerListView from "../../../cocos/listview/GridLayerListView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyTaskView extends BaseView {
    @property(cc.Button)
    public back: cc.Button = null;

    @property(cc.ScrollView)
    public list: cc.ScrollView = null;


    @property(GridLayerListView)
    public gridLayerListView: GridLayerListView = null;

    protected model: DailyTaskMgr;
    protected itemList: DailyTaskItemModel[]
    onEnter() {
        let list = this.model.getTaskItemModelList()
        this.itemList = list;
        this.gridLayerListView.totalCount = list.length;

    }


    updateItem(listView: GridLayerListView, pos: number, item: cc.Node): void {
        // cell.setImg(cell.dataSource);
        let list = this.itemList
        // console.log(' updateItem pos ', pos)
        let cell = item.getComponent(DailyTaskItemView)
        cell.setModel(list[pos])
        cell.setController(this.controller)
        cell.content()

        // cell.setController(this.controller)

    }


    onbackButtonClick() {
        this.hide();
    }
}