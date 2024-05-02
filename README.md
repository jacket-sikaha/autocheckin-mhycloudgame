# autocheckin-mhycloudgame

- 基于 nextjs14 开发的云原神自动签到程序
- 采用 github action schedule 形式调用 nextjs 项目接口，完成签到

```javascript
// 邮箱通知服务
SMTP_USER = xxxxx; // SMTP服务用户名

SMTP_PASSWORD = xxxx; // SMTP服务用户对应密钥

SMTP_HOST = xxxx; // SMTP服务host

SMTP_PORT = xxx; // SMTP服务port

EMAIL_FROM = xxxxx; // 发email人
EMAIL_TO = xxxxx; // 接收email人

// mhy账号签到所需携带信息
// 参考 https://bili33.top/posts/MHYY-AutoCheckin-Manual-Gen2
X_RPC_COMBO_TOKEN = xxxxx;
X_RPC_CLIENT_TYPE = xxxx;
X_RPC_SYS_VERSION = "xxxxx";
X_RPC_DEVICE_ID = "xxxx";
X_RPC_DEVICE_NAME = "xxxx";
X_RPC_DEVICE_MODEL = "xxxx";

// 日志存储服务信息（非必填）
MONGODB_USER = xxxx;
MONGODB_PASSWD = xxxx;
```

[配置教程参考](https://bili33.top/posts/MHYY-AutoCheckin-Manual-Gen2)

```yml
name: 定时任务

on:
  push:
    branches:
      - main
  schedule:
    - cron: "0 */5 * * *"
    #执行时间按自己要求定义，但GitHub执行action与实际时间是会有一定延迟的

jobs:
  execute:
    runs-on: ubuntu-latest

    steps:
      - name: 检出代码
        uses: actions/checkout@v4

      - name: Run shell script
        run: bash job.sh
```
