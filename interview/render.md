#浏览器渲染原理
## script的async和defer
### async
- 不会阻塞页面渲染,而是直接下载然后运行
- 脚本之间彼此独立,运行次序无法控制
### defer
- 按顺序执行
### 调整策略
- 如果脚本无需等待页面解析，且无依赖独立运行，那么应使用 async。
- 如果脚本需要等待页面解析，且依赖于其它脚本，调用这些脚本时应使用 defer，将关联的脚本按所需顺序置于 HTML 中。
### async 和 defer区别
- async无法保证顺序,且下载完就会执行
- defer会等待整个HTML解析之后才开始执行,并且按照插入的顺序执行

## DNS查询
### DNS预查询
dns-prefetch
```
<link rel="dns-prefetch" href="https://www.baidu.com">
```
### keep-alive
http1.1
- 每条独立的TCP链接都会进行三次握手
- 加入keep-alive保持TCP链接一段时间不断开
- 复用同一个TCP, 因为管道化原因,会产生对头阻塞

### http2
多路复用
- 采用更小的二进制帧构成多条数据流
- 交错的请求和响应可以并行传输不被阻塞