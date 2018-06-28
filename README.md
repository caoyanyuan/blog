# blog
express+mongodb+node 搭建的博客实战项目

### 第三方插件：

bodyParser ：解析post请求数据<br/>
cookie ： 读写cookie<br/>
swig：模板解析引擎<br/>
mongoose： 操作mongodb数据库<br/>
markdown： markdown语法解析生成模块<br/>

### 项目目录

| 目录/文件 | 说明 | 
| ------------- |:-------------:|
| db |数据库存储目录 |
| models | 数据库模型文件目录 |
| public | 公共静态文（css，js等） | 
| schemas |数据库结构文件（schema）目录| 
| views | 模板视图文件目录 | 
| app.js | 应用启动（入口）文件|

### 三大模块

#### main模块
*  /      首页 
* /view   内容页 

#### api模块
* /user/register      用户注册
* /user/login         用户登录
* /comment            评论获取
* /comment/post       评论提交

#### admin模块
* 用户管理
  * /user             用户管理
* 分类管理
  * /category         分类列表
  * /category/add     分类添加
  * /category/edit    分类编辑
  * /categoty/delete  分类删除
* 文章内容管理
  * /article          文章列表
  * /article/add      文章添加
  * /article/edit     文章编辑
  * /article/delete   文章删除
* 评论管理
  * /comment          评论列表
  * /comment/delete      评论删除
