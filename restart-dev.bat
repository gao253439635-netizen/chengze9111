@echo off
chcp 65001 >nul
cd /d "F:\高祥BOSS优化_（简历）\ai-archmage"

echo 正在关闭占用 9111 / 9112 的旧进程...
powershell -NoProfile -Command "$p=Get-NetTCPConnection -LocalPort 9111,9112 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; if($p){$p|ForEach-Object{Stop-Process -Id $_ -Force}}"
timeout /t 2 >nul

echo 重新启动开发服务（前端 9111 + 后端 9112）...
start "" /min npm run dev:all

echo.
echo 完成。稍等几秒，然后：
echo   1) 浏览器打开 http://localhost:9111/admin
echo   2) 按 Ctrl+Shift+R 硬刷新
echo   3) 再点「保存」应可成功
echo.
echo 验证：浏览器访问 http://localhost:9111/api/v1/auth/status
echo       正常应显示  "authEnabled":false
echo       若仍显示 true，说明还有别的进程/环境变量在强制开启。
pause
