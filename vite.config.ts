import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// 说明：后台 API 已统一收口到独立 Express 服务（server/index.ts）。
// 开发期 vite 只负责前端（HMR），通过代理把同源 /api 转发到 API 服务（默认 9112）。
// 生产期用 `npm run build` + `npm run start`，由独立服务同时托管静态资源与 API（端口 9111）。

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // 忽略上传目录，避免后台/接口上传图片触发页面刷新
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : { ignored: ['**/public/uploads/**'] },
      // 开发期：前端同源打到 /api，由代理转发到独立 API 服务（端口 9112）
      proxy: {
        // 后台上传的图片落在 public/uploads/，dev 下 Vite 不直服该目录（会被 SPA 回退成 HTML），
        // 故代理到后端(9112)取图，保证前台 <img src="/uploads/..."> 与后台缩略图都能正常显示。
        '/uploads': {
          target: 'http://localhost:9112',
          changeOrigin: true,
        },
        '/api': {
          target: 'http://localhost:9112',
          changeOrigin: true,
        },
      },
    },
    preview: {
      // `vite preview` 同样转发 /api、/uploads 到独立 API 服务，保证预览期 API 与上传图可用
      proxy: {
        '/uploads': {
          target: 'http://localhost:9112',
          changeOrigin: true,
        },
        '/api': {
          target: 'http://localhost:9112',
          changeOrigin: true,
        },
      },
    },
  };
});
