# 宏任务
## setTimeout
## setInterval
## MessageChannel
## I/O
## setImmediate(node)
## script

# 微任务
## MutationObserver(browser)
## Promise(then/catch/finally)
## process.nextTick(node)
## queueMicrotask

# EventLoop
每个循环中判断:

1.判断宏任务队列是否为空

- 不空 -> 执行最早进入队列的事件 -> 下一步
- 空 -> 下一步

2.判断微任务队列是否为空

- 不空 -> 执行最早进入队列的事件 -> 判断微任务队列是否为空
- 空 -> 执行下一步

因为首次执行宏队列中会有 script（整体代码块）任务，所以实际上就是 Js 解析完成后，在异步任务中，会先执行完所有的微任务，这里也是很多面试题喜欢考察的。需要注意的是，新创建的微任务会立即进入微任务队列排队执行，不需要等待下一次轮回。

# web性能衡量指标
## 首次内容绘制 - First Contentful Paint (FCP)
- 测量从页面开始加载到页面内容的任何部分在屏幕上呈现的时间
- 控制在1.8s以内
### 优化
- 消除渲染阻塞资源
- 缩小 CSS
- 删除未使用的 CSS
- 预连接到所需的源
- 减少服务器响应时间 (TTFB)
- 避免多个页面重定向
- 预加载密钥请求
- 避免巨大的网络负载
- 使用高效的缓存策略为静态资产提供服务
- 避免过大的 DOM 大小
- 最小化关键请求深度
- 确保文本在 webfont 加载期间保持可见
- 保持较低的请求数量和较小的传输大小
## 最大内容绘制 - Largest Contentful Paint (LCP)
- 测量从页面开始加载到最大文本块或图像元素在屏幕上呈现的时间
- 控制在2.5s以内
### 优化
- 使用 PRPL 模式应用即时加载
- 优化关键渲染路径
- 优化你的 CSS
- 优化您的图像
- 优化网页字体
- 优化您的 JavaScript
## 首次输入延迟 - First Input Delay(FID)
- 测量从用户第一次与用户交互(点击按钮,链接,使用自定义的、由javascript驱动的控件)到浏览器实际能够开始处理事件处理程序的时间以回应这种互动
- 100ms以内
## 交互时间 - Time To Interactive(TTI)
- 测量从页面开始加载到可视化呈现、其初识脚本(如果有)已加载并且能够快速可靠地响应用户输入的时间
- 5s以内
### 优化
- 缩小 JavaScript
- 预连接到所需的源
- 预加载密钥请求
- 减少第三方代码的影响
- 最小化关键请求深度
- 减少 JavaScript 执行时间
- 最小化主线程工作
- 保持较低的请求数量和较小的传输大小
## 总阻塞时间 - Total Blocking Time(TBT)
- 测量 FCP 和 TTI 之间主线程被阻塞足够长的时间以防止输入响应的总时间
- 300ms以内
## 累计布局偏移 - Cumulative Layout Shift(CLS)
- 测量在页面开始加载和其生命周期状态变为隐藏之间发生的所有意外布局偏移的累积分数
- 0.1以下
### 优化
- img设置width,height,srcset
- 减少重排

