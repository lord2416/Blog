# 机器人构建
## 创建机器人
### 首页配置
#### 广告轮播
#### 
## 创建入口
## 创建知识库
### 新增知识库
- 知识库名称：自定义，建议命名xxx知识库。
- 创建完成后，可以对知识库进行修改、状态变更等。
### 创建知识分类
- 三级,其中一级和二级分类，代表用户的意图，第三级分类代表用户的领域。
- 分类名使用文字，尽量不使用特殊字符等，以免影响应答效果。
- 一级分类、二级分类、三级分类可以创建多个，且每个分类下可创建多个子级分类
### FAQ创建、编辑
- 标准答案：标准答案支持图片、超链接、表格、无序列表等，也支持对文字内容进行加粗、颜色调整、下划线等富文本形式操作。
- 标准问句、问题备注、标准答案、备注、所属分类详见批量导入FAQ。
- 状态：有启用和停用两种状态，与生效时间一起使用。停用状态时，不会使用此FAQ知识应答。
- 是否智能补全过滤：如果选择是，那么保存FAQ的时候，这条FAQ就不会同步到输入补全的索引，但是不影响机器人的应答，选择否，则会同步到输入补全索引。智能补全功能目的是为了减少用户输入。智能补全功能效果，详见下方截图。
- 生效时间：FAQ的生效时间，与状态一起使用。比如活动类，配置到期后，此FAQ自动失效不触发。
- 可以预览FAQ答案的展示效果
### 相似问题的创建、编辑
- 手动新增、删除
- 根据深度学习模型自动生成，通过人工审核后，方可应用
- 去重
### FAQ草稿
FAQ在创建或修改时，可提交审核，审核通过的答案方可发布使用，这样确保答案内容正确无误，降低业务风险，同时也跟踪到最后修改人
- 添加：添加FAQ后，点击保存按钮，选择不同的操作备注，可进行审核或不进行审核。
- 修改：修改完FAQ后，点击保存按钮，选择不同的操作备注，可进行审核或不进行审核。处于草稿中的FAQ，修改前的答案仍然对客使用，不会停用该条FAQ。
- 审核通过：点击知识体系下的“FAQ草稿”，点击FAQ问题进入编辑页面，在页面下方可进行审核，审核通过的FAQ，直接发布使用。
- 审核不通过：点击知识体系下的“FAQ草稿”，点击FAQ问题进入编辑页面，在页面下方可进行审核，审核不通过的FAQ，仍存在FAQ草稿中，直到审核通过后，才会发布使用新的FAQ答案。
### 服务引导答案
FAQ服务引导答案的意义在于通过调用业务接口返回给用户差异性答案，比如用户账户状态、用户欠款状态、用户账单日等
### 答案模板答案
此处的答案主要是针对答案需要配置成json串定制的模板，主要用在通过接口调用，需要答案形式为json格式的答案。
- 先配置模板对应的key值信息
- 答案编辑时，选怎模板后，根据对应的名称输入内容
## 对话能力
### 进线配置
- 支持不同终端
### 规则配置
- 