
:放在D盘下了
f:
cd %cd%

:数据目录

set data_path=F:\work\Dream_house-main\DreamhouseEn\data
set export_path=F:\work\Dream_house-main\DreamhouseEn\export
:项目目录
set copy_path=F:\work\Dream_house-main\DreamhouseEn\assets\resources\data

node read_all.js game %data_path%  %export_path% %copy_path%
pause