cd %cd%
set project_path=F:\project\love-and-house2-d
set build_path=%project_path%\build-game\oppo
set release_path=%project_path%\build\quickgame
node build.js %build_path%  %release_path%

cd %release_path%

npm run release

pause