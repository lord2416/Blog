# Webpack中的module是指什么
webpack ⽀持ESModule, CommonJS, AMD, Assets等.
可以设置 package.json 中的属性来显式设置⽂件模块类型。
在 package.json 中
设置 “type”: “module” 会强制 package.json 下的所有⽂件使⽤ ECMAScript 模块。
设置 “type”: “commonjs” 将会强制使⽤ CommonJS 模块。

1. ESM
2. CommonJS
module.exports 允许将 CommonJS 中的内容暴露给其他模块,
require 允许从其他模块获取引⽤到 CommonJS 中.

# 所以webpack modules 如何表达⾃⼰的各种依赖关系?
ESM import 语句
CommonJS require() 语句
AMD define 和 require 语句
css/sass/less ⽂件中的 @import 语句。
stylesheet url(…) 或者 HTML ⽂件中的图⽚链接。

# 那么问题⼜来了, 我们常说的 chunk 和 bundle 的区别是什么?

1. Chunk

Chunk是Webpack打包过程中Modules的集合，是打包过程中的概念。
Webpack的打包是从⼀个⼊⼝模块开始，⼊⼝模块引⽤其他模块，模块再引⽤模块。
Webpack通过引⽤关系逐个打包模块，这些module就形成了⼀个Chunk。
当然如果有多个⼊⼝模块，可能会产出多条打包路径，每条路径都会形成⼀个Chunk。

2. Bundle

Bundle是我们最终输出的⼀个或多个打包好的⽂件.

3. Chunk 和 Bundle 的关系?

⼤多数情况下，⼀个Chunk会⽣产⼀个Bundle。

```
module.exports = {
 mode: "production",
 entry: {
 index: "./src/index.js"
 },
 output: {
 filename: "[name].js"
 },
 devtool: "source-map"
};
```

但是当我们开启source-map后, chunk和bundle就不是⼀对⼀的关系了.

可以看⼀下webpack的输出, ChunkNames只有⼀个Index, ⽽输出了两个bundle. index.js, 
index.js.map.
所以可以有这样的⼀个总结：
Chunk是过程中的代码块，Bundle是打包结果输出的代码块, Chunk在构建完成就呈现为
Bundle。

4. ⽣成Chunk的⼏种⽅式

- entry配置⼀个key, value为数组
```
module.exports = {
 mode: "production",
 entry: {
 index: ["./src/index.js", "./src/add.js"]
 },
 output: {
 filename: "[name].js"
 }
};
```
可以看到这种情况, 也只会产⽣⼀个chunk.

- entry配置多个key
```
module.exports = {
 mode: "production",
 entry: {
 index: "./src/index.js",
 common: "./src/common.js"
 },
 output: {
 filename: "[name].js"
 },
};
```
可以看到这种情况, 产⽣了common和index两个chunk, 配置的key也就会被⽤为chunkName.
⽽output中filename字段, 将被⽤为bundle的名称。

- Split chunk

# ⽐较重要的⼀些概念

## Compiler 和 Compilation
1. Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯⼀的，可以简单地把它理解为Webpack 实例；
2. Compilation 对象包含了当前的模块资源、编译⽣成资源、变化的⽂件等。当 Webpack 以开发模式运⾏时，每当检测到⼀个⽂件变化，⼀次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。

## Plugin 和 Loader 分别是做什么的? 怎么⼯作的?

1. loader
模块转换器，将⾮js模块转化为webpack能识别的js模块.

loader 让 webpack 能够去处理那些⾮ JavaScript ⽂件.
Loader 可以将所有类型的⽂件转换为 webpack 能够处理的有效模块,然后你就可以利⽤
webpack 的打包能⼒,对它们进⾏处理。
本质上,webpack loader 将所有类型的⽂件,转换为应⽤程序的依赖图（和最终的 bundle）可
以直接引⽤的模块。

2. Plugin

扩展插件，在webpack运⾏的各个阶段，都会⼴播出去相对应的事件，插件可以
监听到这些事件的发⽣，在特定的时机做相对应的事情

Loader 被⽤于转换某些类型的模块,⽽插件则可以⽤于执⾏范围更⼴的任务。
插件的范围包括,从打包优化和压缩,⼀直到重新定义环境中的变量。插件接⼝功能极其强⼤,可
以⽤来处理各种各样的任务。

在 webpack 运⾏的⽣命周期中会⼴播出各种事件，Plugin 就可以监听这些事件，在触发时通
过 webpack 提供的 API 改变输出结果。
在插件中，可以拿到 Compile 和 Compilation 的引⽤对象，使⽤它们⼴播事件，这些事件可
以被其他插件监听到，或者对他们做出⼀定修改，其他插件拿到的也是变化的对象。

## 能简单描述⼀下webpack的打包流程吗

1. 初始化参数：从配置⽂件和 Shell 语句中读取与合并参数,得出最终的参数。
2. 开始编译：⽤上⼀步得到的参数初始化 Compiler 对象,加载所有配置的插件,执⾏对象的 run ⽅法开始执⾏编译
3. 确定⼊⼝：根据配置中的 entry 找出所有的⼊⼝⽂件。
4. 编译模块：从⼊⼝⽂件出发,调⽤所有配置的 Loader 对模块进⾏翻译,再找出该模块依赖的模块,再递归本步骤直到所有⼊⼝依赖的⽂件都经过了本步骤的处理
5. 完成模块编译：在经过第 4 步使⽤ Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
6. 输出资源：根据⼊⼝和模块之间的依赖关系,组装成⼀个个包含多个模块的 Chunk,再把每个Chunk 转换成⼀个单独的⽂件加⼊到输出列表,这步是可以修改输出内容的最后机会
7. 输出完成：在确定好输出内容后,根据配置确定输出的路径和⽂件名,把⽂件内容写⼊到⽂件系统