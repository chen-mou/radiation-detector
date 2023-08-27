const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const search = require('./utils/search'),
    result = require('./utils/result')

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数


// 获取计数


// 小程序调用，获取微信 Open ID
// app.get("/api/wx_openid", async (req, res) => {
//   if (req.headers["x-wx-source"]) {
//     res.send(req.headers["x-wx-openid"]);
//   }
// });

//测试的请求体
// {
//   "action": "CheckContainerPath"
// }

function middle(req, res, next) {
  const body = req.body
  switch (body.action) {
    case "CheckContainerPath":
      res.json({});
    default:
      next()
  }
}

app.get("/api/areaRadiation", middle, function (req, res) {
  const body = req.body,
      userId = body.FromUserName,
      meId = body.ToUserName,
      content = body.Content,
      type = body.MsgType;
  if (type != "text") {
    res.json(result.text("不支持的消息类型", meId, userId))
  }
  const data = search.getAreaRadiation(content)
  if (data == null) {
    res.json(result.text("消息应为一个省份名", meId, userId))
  }
  res.json(result.text(`${content}省空气吸收剂量率为:${data.value}
  数据截止日期:${data.date}
  数据来源:生态环境部辐射环境检测技术中心`, meId, userId))
});

const port = process.env.PORT || 80;

async function bootstrap() {
  // await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
