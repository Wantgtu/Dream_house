
:放在D盘下了
d:
cd %cd%

:数据目录

set data_path=D:\projects\LoveAndHouse\LoveAndHouse2D\data
set export_path=D:\projects\LoveAndHouse\export
:项目目录
set copy_path=D:\projects\LoveAndHouse\LoveAndHouse2D\assets\resources\data

node read_all.js game %data_path%  %export_path% %copy_path%
pause