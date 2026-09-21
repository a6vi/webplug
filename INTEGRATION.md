# 三个页面的原生集成与更新

本项目使用 Expo SDK 57 和 Expo Brownfield。原生宿主直接打开以下 React Native 组件名，不经过首页：`SkiData`、`AiAnalysis`、`ResortWeather`。入口注册在 `src/entry.tsx`。`main` 仅作为兼容入口，显示滑雪数据页。

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
