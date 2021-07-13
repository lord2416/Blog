# Fiber
## Fiber是一个多义词
- 字面意思, “纤程”, 意在对渲染过程实现更加精细的控制
- 从架构角度看, Fiber是对React核心算法（即调和过程）的重写
- 从编码角度看, Fiber是React定义的一种数据结构,是Fiber树结构的节点单位, 也是React 16新架构下的“虚拟DOM”
- 从工作流角度看, Fiber节点保存了组件需要更新的状态和副作用, 一个Fiber同时对应一个工作状态

## Fiber架构
Fiber架构的目的, 是实现**增量渲染**
### 为什么需要Fiber
1. - 对于大型项目,组件树相对较大,递归遍历的成本很大,会造成主线程被持续占用,结果就是主线程上的布局、动画等周期性任务无法得到立即处理,造成视觉上的卡顿,影响用户体验
2. 任务分解的意义
3. 增量渲染(把任务差分,匀到多帧)
4. 更新时能暂停、终止,复用渲染任务
5. 给不同类型的更新赋予优先级
6. 并发方面新的基础能力
7. 更流畅

### 增量渲染
把一个渲染任务拆分成多个渲染任务, 而后将其分散在多个帧里执行。
增量渲染的目的: 
为了实现任务的可中断、可恢复,并给不同的任务赋予不同的优先级, 最终达到顺滑的用户体验

### 核心
- 可中断
- 可恢复
- 优先级
通过Scheduler(调度器)

### render阶段
- beginWork
1.根据fiber节点(wif)的tag属性不同,调用不同的节点创建函数
### commit阶段
分为3个阶段
- before mutaition
1.DOM节点还没有被渲染到界面上
2.会触发getSnapshotBeforeUpdate,
也会触发useEffect钩子相关的调度逻辑
- mutation
1.负责DOM节点的渲染
2.在渲染过程中,遍历effectList,根据flags(effectTag)的不同,执行不同的DOM操作
- layout
1.处理DOM渲染完毕之后的收尾逻辑
2.会调用componentDidMount/componentDidUpdate
也会调用useLayoutEffect钩子函数的回调
3.会把fiberRoot的current指针指向workInProgressFiber


## 
1. generator有类似的功能, 为什么不直接使⽤?
React开发⼈员在git issue⾥回答过这个问题. 总结起来主要的就是两点:
要使⽤generator的话, 需要将涉及的所有代码都包装成generator * 的形式, ⾮常麻烦
generator内部是有状态的, 很难在恢复执⾏的时候获取之前的状态.