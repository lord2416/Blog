#DOM
- 文档对象模型
- DOM模型用一个逻辑树(对象)来表示一个文档,树的每个分支的终点都是一个节点,每个节点都包含着对象。
- 定义了处理文档内容的方法和接口
#BOM
- 浏览器对象模型
- BOM的核心是window对象,表示浏览器的实例
- window对象有两重身份:
    1.Global对象
    2.浏览器窗口的javascript接口
  这意味着网页中定义的所有对象、变量和函数都作为Global对象的一个属性或方法存在
- window对象包含: location, navigator, screen等子对象, 并且DOM的最根本对象document对象也是BOM的window对象的子对象