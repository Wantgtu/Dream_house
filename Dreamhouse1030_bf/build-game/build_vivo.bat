cd %cd%
set project_path=F:\project\love-and-house2-d
set build_path=%project_path%\build-game\vivo
set release_path=%project_path%\build\qgame
node build.js %build_path%  %release_path%

cd %release_path%

npm run release

pause