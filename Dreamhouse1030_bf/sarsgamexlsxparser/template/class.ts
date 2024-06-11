import { DataModel } from "../../../cfw/cfw";


%enum%

/**
* %SheetName%
**/
export default class %ClassName% extends DataModel {

	static CLASS_NAME:string = '%ClassName%'
	constructor() {
		super(%ClassName%.CLASS_NAME)
	}
	%function%


}