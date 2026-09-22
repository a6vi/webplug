# 三个页面的原生集成与更新

本项目使用 Expo SDK 57 和 Expo Brownfield。原生宿主直接打开以下 React Native 组件名，不经过首页：`SkiData`、`AiAnalysis`、`ResortWeather`。入口注册在 `src/entry.tsx`。`main` 仅作为兼容入口，显示滑雪数据页。

## 在 GitHub Actions 手动交付

仓库提供两个手动触发的工作流，分别位于 `.github/workflows/build-native-libraries.yml` 和 `.github/workflows/publish-page-update.yml`。把文件提交并推送到 GitHub 的默认分支后，在仓库 **Actions** 页面选择对应工作流，点击 **Run workflow**，选择要构建的分支，再点击绿色的 **Run workflow**。工作流只处理所选分支中已经推送的代码；Windows 本地未提交或未推送的修改不会包含在内。

### 首次准备页面更新服务器

1. 在 `myski.ski` 服务器上安装 `rsync`，创建 `/var/www/html/appplug/`，并给专用部署用户这个目录及其子目录的写权限。不要让部署用户拥有整个网站的写权限。
2. 在本地运行 `npm run export-assets`，按下文“热更新”章节将 `dist/nginx-expo-updates.conf` 中的 `map` 和 `location` 配置加入 Nginx，执行 `nginx -t` 并重载。这个 Nginx 配置只需初次部署或更新地址、运行版本规则发生变化时检查；工作流不会自动修改 Nginx 配置。
3. 给部署用户准备 SSH 密钥登录：将**公钥**加入服务器该用户的 `~/.ssh/authorized_keys`；**私钥**只放在 GitHub Secret，不要提交到仓库。向服务器管理员核对 SSH 主机公钥指纹，再取得对应的 `known_hosts` 行。
4. 在 GitHub 仓库 **Settings → Secrets and variables → Actions → New repository secret** 添加下表四项：

| Secret | 内容 |
| --- | --- |
| `DEPLOY_HOST` | SSH 服务器域名或 IP；不带 `https://` |
| `DEPLOY_USER` | 有权写入 `/var/www/html/appplug/` 的部署用户名 |
| `DEPLOY_SSH_KEY` | 与服务器公钥匹配的完整 SSH 私钥，包括 BEGIN/END 行 |
| `DEPLOY_KNOWN_HOSTS` | 已核对指纹的 SSH 主机密钥行，例如 `myski.ski ssh-ed25519 ...`；若 `DEPLOY_HOST` 填 IP，此处也要有对应 IP 的记录 |

### 构建原生库并交给宿主团队

适用于首次集成，或升级 Expo SDK、增加原生依赖、修改原生配置后。先确认 `app.json` 中 `expo.version` 和 Brownfield Android `version` 是本次要交付的版本，然后推送代码。在 **Actions → Build native libraries → Run workflow** 启动构建。Android 在 Linux runner 构建，iOS 在 macOS 26 runner 构建；本地 Windows 不需要安装 Xcode。

两个任务都成功后，打开本次运行页面，在 **Artifacts** 下载 `android-maven-library` 和 `ios-xcframeworks`。将两个压缩包连同版本号交给宿主团队：Android 产物是 `com/myski/...` 形式的 Maven 仓库目录，宿主可将其放进本地或团队 Maven 仓库，并引用 `com.myski:MyskiPlug:<版本>`；iOS 产物包含 XCFramework，宿主需按其 Xcode 集成方式加入工程。工作流只生成可下载产物，不会自动修改宿主工程或发布应用商店。

### 日常发布页面更新

只修改页面 JS、样式或图片时，先在 Android/iOS 测试宿主中确认显示效果，然后提交并推送代码。在 **Actions → Publish page update → Run workflow** 选择分支并运行。工作流执行 `npm run export-assets`，将 `dist` 保存为本次运行的 Artifact，再经 SSH 上传到 `/var/www/html/appplug/`：先传 JS 和图片，最后传 iOS/Android manifest。它不会删除服务器上的旧资源，并会检查线上两个 manifest 的 ID 是否与本次导出相同。

运行成功后，让测试设备重启宿主应用，确认三个页面都加载了新样式，再用于正式环境。当前工作流直接发布到 `https://myski.ski/appplug/`，没有单独的测试环境，也没有自动回滚。若需要区分测试和正式环境，应先分别配置更新地址和部署目标，再启用对应发布流程。

当前 `package-lock.json` 未纳入 Git 跟踪；工作流在没有锁文件时使用 `npm install`。建议将锁文件纳入 Git，以便以后固定 CI 构建依赖并使用 `npm ci`。

## 打包为 iOS / Android 库

`app.json` 已定义 iOS `MyskiPlug` XCFramework 和 Android `com.myski:MyskiPlug:1.0.0` 库。构建命令：

```sh
npx expo-brownfield build:android --release
npx expo-brownfield build:ios --release
```

iOS 构建需要 macOS 和 Xcode。宿主应用需按 [Expo Brownfield isolated approach](https://docs.expo.dev/brownfield/isolated-approach/) 加载库。

## 原生页面与数据交互

宿主在打开页面前写入 Brownfield 共享状态；页面通过 `useSharedState` 获取数据，并在宿主更新状态时自动刷新。状态键和字段定义见 `src/native-data.ts`。字段可省略，省略时页面显示设计稿演示值。

| 组件名 | 共享状态键 | 主要数据 |
| --- | --- | --- |
| `SkiData` | `myski.skiData` | 雪场名、雪道名、里程、速度、落差、滑行指标 |
| `AiAnalysis` | `myski.aiAnalysis` | 问题、回答 |
| `ResortWeather` | `myski.resortWeather` | 雪场名、每日天气、逐小时温度和风速 |

Android 宿主（Kotlin）：

```kotlin
import expo.modules.brownfield.BrownfieldState
import com.myski.myskiplug.BrownfieldActivity

class SkiDataActivity : BrownfieldActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    BrownfieldState.set("myski.skiData", mapOf(
      "resortName" to "成都热雪奇迹",
      "trailNames" to listOf("高级道", "练习道"),
      "distanceKm" to 24.6,
      "turns" to 3679,
      "verticalDropM" to 3559,
      "maxSpeedKmh" to 120
    ))
    showReactNativeFragment("SkiData")
  }
}
```

打开天气页时写 `myski.resortWeather`，调用 `showReactNativeFragment("ResortWeather")`。打开 AI 页时写 `myski.aiAnalysis`，调用 `showReactNativeFragment("AiAnalysis")`。页面已显示后，继续调用 `BrownfieldState.set` 即可推送新数据。宿主还可通过 `BrownfieldMessaging.addListener` 收到页面发出的 `aiQuestion` 和 `openPage` 消息。

iOS 宿主（Swift）：

```swift
import MyskiPlug

ReactNativeHostManager.shared.initialize()
BrownfieldStateInternal.shared.set("myski.resortWeather", [
  "resortName": "成都热雪奇迹",
  "days": [["weekday": "周二", "icon": "🌧", "tempC": -5]],
  "hourly": [["hour": "11", "icon": "☀", "tempC": 2,
              "feelsLikeC": -1, "precipMm": 0, "windKt": 5, "gustKt": 14]]
])
let page = ReactNativeViewController(moduleName: "ResortWeather")
navigationController?.pushViewController(page, animated: true)
```

同样可用 `moduleName: "SkiData"` 或 `moduleName: "AiAnalysis"`。页面显示后再次调用 `BrownfieldStateInternal.shared.set` 可更新数据。iOS 可用 `BrownfieldMessaging` 接收页面消息。宿主应在应用启动时初始化一次 `ReactNativeHostManager`，并在对应导航控制器中展示页面。

## 热更新

三个页面位于同一 JS bundle 中，`expo-updates` 在发布新 bundle 后同时更新它们。当前 `app.json` 配置更新地址为 `https://myski.ski/appplug/manifest.json`，运行版本按应用版本 `1.0.0` 匹配。

```sh
npm run export-assets
```

命令自动生成 `dist/ios/manifest.json`、`dist/android/manifest.json` 和 `dist/nginx-expo-updates.conf`。将 `dist` 的**内容**上传到服务器的 `/var/www/html/appplug/`，并将生成的 Nginx 配置中 `map` 放入 `http` 块、`location` 放入 `myski.ski` 的 HTTPS `server` 块，然后执行 `nginx -t` 并重载。已有的 `_expo` 和 `assets` 中的旧哈希文件需保留，避免正在下载旧版本的客户端失败。

同一个更新 URL 必须依据 `expo-platform` 和 `expo-runtime-version` 请求头选择 iOS 或 Android 的静态 manifest；因此仅用普通静态文件服务器直接返回一个 `manifest.json` 不够。生成的 Nginx 配置负责这一步，无需运行 Node 更新服务。部署后可用以下命令检查：

```sh
curl -i -H 'expo-protocol-version: 1' -H 'expo-platform: ios' -H 'expo-runtime-version: 1.0.0' https://myski.ski/appplug/manifest.json
curl -i -H 'expo-protocol-version: 1' -H 'expo-platform: android' -H 'expo-runtime-version: 1.0.0' https://myski.ski/appplug/manifest.json
```

仅修改 JS / 图片 / 样式时可以热更新；新增或升级原生依赖、改变原生配置时应重新构建并分发 iOS/Android 库，同时升级 `app.json` 中的 `version`。此次静态方案不实现更新签名、回滚指令或按用户分批发布。

雪场地图为原生视图绘制的示意背景；天气、滑行和 AI 文本可由宿主提供。页面中的搜索和图表目前只是展示 UI，宿主可按产品需要继续接入交互。
