# MVC

## Model

- Model是对应用状态和业务功能的封装，我们可以将它理解为同时包含数据和行为的领域模型

- Model接收Controller的请求并完成相应的业务处理，在状态改变的时候向View发出相应的通知

## View

- View实现可视化界面的呈现并捕捉最终用户的交互操作(例如鼠标和键盘的操作)
- View捕获到用户交互操作后直接转发给Controller，后者完成相应的UI逻辑。如果需要涉及业务功能的调用， Controller会直接调用Model。在完成UI处理后，Controller会根据需要控制原View或者创建新View对用户操作予以响应

# MVP

## MVP特点
- MVP全称为Model-View-Presenter，Model提供数据，View负责显示，Contoller/Presenter负责逻辑的处理。
- MVP是从经典模式MVC演变而来

## MVP与MVC区别
- MVC模式中元素之间“混乱”的交互主要体现在允许View和Model直接进行“交流”，这在MVP中是不允许的
- 在MVP中View并不直接使用Model，他们之间的通信是通过Presenter来进行的，所有的交互都发生在Presenter内部，而在MVC中View会直接从Model中读取数据而不是通过Controller