# TG 上手指南

这是一个手机优先的静态引导页，已经填好网络工具、Telegram 官方下载和频道入口，不需要数据库或安装依赖。

## 当前流程

苹果手机：

1. 通过 Apple 官方页面自行创建可用的 Apple 账号。
2. 打开 KTM Cloud 注册入口，按页面说明安装并连接网络工具。
3. 从 App Store 安装 Telegram Messenger。
4. 使用自己的手机号登录 Telegram，并进入频道。

安卓手机：

1. 打开 KTM Cloud 注册入口，按页面说明安装并连接网络工具。
2. 从 `telegram.org` 下载官方 APK 并安装。
3. 使用自己的手机号登录 Telegram，并进入频道。

页面会在当前设备上保存进度。每个外部入口都提供“打开”和“复制链接”，并提示微信、QQ 用户通过右上角菜单切换到系统浏览器。

## 已配置的链接

| 用途 | 链接 |
| --- | --- |
| 网络工具注册 | https://ktmcloud.vip/#/register?code=TEAfip3S |
| 频道入口 | https://fanshen-trading-park.vercel.app/ |
| Apple 账号注册 | https://account.apple.com/ |
| Apple 官方注册教程 | https://support.apple.com/zh-cn/108647 |
| iPhone Telegram | https://apps.apple.com/us/app/telegram-messenger/id686449807 |
| 安卓 Telegram 官网 | https://telegram.org/android |
| 安卓官方 APK | https://telegram.org/dl/android/apk |

如果以后要更换网络工具或频道，只修改 `dist/config.js`。

## 本地查看

直接用浏览器打开 `dist/index.html`。部分浏览器会限制本地页面复制链接；通过 GitHub Pages 发布后该功能正常。

## GitHub Pages 部署

最简单的发布方式：

1. 在 GitHub 新建一个公开仓库，例如 `tg-guide`，默认分支使用 `main`。
2. 将 `dist` 文件夹里面的 `index.html`、`styles.css`、`config.js`、`app.js` 和 `.nojekyll` 上传到仓库根目录。
3. 打开仓库 `Settings → Pages`。
4. `Source` 选择 **Deploy from a branch**，分支选择 **main**，目录选择 **/ (root)**，保存。
5. 等待部署完成，GitHub 会显示网站地址，通常是 `https://你的用户名.github.io/tg-guide/`。

本项目也附带 `.github/workflows/pages.yml`。如果希望保留 `dist/` 目录结构，可将整个项目上传，并在 Pages 的 Source 中选择 **GitHub Actions**。两种部署方式选一种，不要混用。

## 发布前检查

- 用一部 iPhone 和一部安卓手机各走完一次流程。
- 在微信或 QQ 中打开网站，确认“在浏览器打开”和“复制链接”的提示清楚。
- 确认网络工具注册页面可以打开，注册和客户端安装说明仍然有效。
- 确认频道入口最终跳转到正确的 Telegram 频道或群。
- 安卓安装包应始终来自 `telegram.org`，不要将第三方 APK 上传到仓库。

页面不会收集 Apple 密码、手机号、验证码或 Telegram 登录信息。

