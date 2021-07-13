#hooks
## what
React 16.8的新增特性,可以让你在不编写class组件的情况下使用state以及其他react特性
## how
## why
1.class组件的痛点:
- this
bind或者箭头函数需要用实践层面的约束来解决设计层面的问题
- 生命周期
不合理的逻辑规划方式
逻辑被分散在各个生命周期函数里

2.hooks能实现业务逻辑的聚合,避免复杂的组件和冗余的代码

3.状态复用:hooks能将复杂问题简单化
- 类组件HOC, renderProps, 造成嵌套过多
- 通过自定义hook, 即可以实现逻辑复用, 又不会破坏组件结构

4.hooks也不是万能的
- 暂时不能完全为函数组件补齐类组件的能力:
  getSnapshotBeforeUpdate, componentDidCatch
- 对开发者的水平有更高的要求, 合理把握耦合和内聚力
- 严格约束:
  1.只在React函数中调用hook
  2.不要在循环、条件或嵌套函数中调用Hook

# useEffect 和 useLayoutEffect的区别
- 共同点: 底层都调用了mountEffectImpl
- useEffect在React的渲染过程中是被异步调用的, 用于绝大部分场景
- useLayoutEffect会在所有DOM变更之后同步调用, 主要用于处理DOM操作、调整样式、避免页面闪烁等问题, 可以使用它来读取DOM布局并同步触发重渲染。
