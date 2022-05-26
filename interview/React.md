# React生命周期

## 挂载
- constructor(props)
- static getDerivedStateFromProps(props, state)
- render()
- componentDidMount()
- * UNSAFE_componentWillMount()
- 
## 更新
- static getDerivedStateFromProps(props, state)
- shouldComponentUpdate(nextProps, nextState)
- render()
- static getSnapshotBeforeUpdate(prevProps, prevState)
- componentDidUpdate(prevProps, prevState, snapshot)
- * UNSAFE_componentWillUpdate(nextProps, nextState)
- * UNSAFE_componentWillReceiveProps(nextProps)

## 卸载
- componentWillUnmount()

## 错误处理
- static getDerivedStateFromError(error)
- componentDidCatch(error, info)

# setState
```
setState(updater, callback)
```
## updater
```
(state, props) => stateChange
```
- updater函数中接收到的state和props都保证为最新
- updater的返回值与state进行浅合并

## callback
- setState的第二个参数为可选的回调函数,它将在setState完成合并并重新渲染组件后执行。
- 通常建议使用componentDidUpdate()来代替此方法

## setState的第一个参数除了接收函数外,还可以接收对象类型:
```
setState(stateChange, callback)
```
- stateChange会将传入的对象浅层合并到新的state中
- 此种形式的setState()也是异步的,并在一个周期内容对多个setState进行批处理
- 后续调用的setState()将覆盖同一周期内先调用setState的值

## 如果后续状态取决于当前状态,建议使用updater函数的形式代替