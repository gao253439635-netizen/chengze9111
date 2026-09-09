@echo off
REM AI 大魔法师作品集 —— 开发服务器自启脚本（最小化窗口运行）
REM dev:all 同时拉起 vite(9111) 与独立 API(9112)，vite 将 /api 代理到 9112
REM 端口固定 9111（网页）+ 9112（API），请勿占用 3000 / 9112
cd /d "F:\高祥BOSS优化_（简历）\ai-archmage"
start "" /min npm run dev:all
