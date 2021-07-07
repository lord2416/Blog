# Set
- 允许存储任何类型的唯一值, 无论是原始值还是对象引用
- 可以按照插入的顺序迭代
```
const set = new Set();
set.add();
set.delete();
set.clear();
set.has();
set.entries（）；
set.keys();
set.values();
```
# WeakSet
- 值必须是对象,不能是任何类型的任意值
- 成员都是弱引用,可以被垃圾回收机制回收
- 可以用来保存DOM节点,不容易造成内存泄漏
- 不可枚举
```
const wSet = new WeakSet();
wSet.add(key, value);
wSet.delete(key);
wSet.has(key);
```
# Map
- 键值对的集合，任何值都可以作为一个键或值
- 可以遍历,可以跟各种数据结构转换
```
const map = new Map();
map.size();
map.set(key, value);
map.get(key);
map.has(key);
map.delete(key);
map.keys();
map.values();
map.entries();
```
# WeakMap
- 只接受对象做为键名(null除外),不接受其他类型的值作为键名
- 键名是弱引用,键值是任意的,键名所指向的对象可以被垃圾回收,此时键名是无效的
- 不能遍历,方法有:get,set,has,delete
```
const wMap = new WeakMap();
wMap.set(key, value);
wMap.get(key);
wMap.has(key);
wMap.delete(key);
```