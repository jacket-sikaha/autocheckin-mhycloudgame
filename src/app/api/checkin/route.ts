import { sendCheckinEMail } from "@/email/emailTransporter";
import { sendMsgToKafka } from "@/kafka";
import { constructLog, getShanghaiDate, messageType } from "@/logger/util";
import logger from "@/logger/winston-config";
import {
  AckNotification,
  AppVersion,
  ListNotification,
  Wallet,
  makeHeader,
} from "@/service";

export async function POST(request: Request) {
  try {
    if (!process.env.EMAIL_TO) {
      throw new Error("邮箱不能为空");
    }
    const appVersion = await AppVersion();
    const headers = makeHeader(appVersion);
    const wallet = await Wallet(headers);
    const list = await ListNotification(headers);
    if (!wallet || !list) {
      const msg = "登录已失效，请重新登录并更新配置！";
      const msgResponse: messageType = {
        msg,
        user: process.env.EMAIL_TO,
      };
      logger.warn(msgResponse);
      await Promise.all([
        sendCheckinEMail(false, msg, process.env.EMAIL_TO),
        sendMsgToKafka(constructLog(msgResponse, "warn")),
      ]);
      return Response.json({ msg });
    }
    const free_time = +wallet.free_time.free_time;
    const over_freetime = +wallet.free_time.over_freetime;
    if (list.length === 0) {
      const msg =
        "获取签到情况成功！今天是否已经签到过了呢？\n" +
        `您目前的免费时长为:${free_time} 分钟。
        超过上限时长为:${over_freetime} 分钟。`;
      const msgResponse: messageType = {
        msg: "already checkin",
        user: process.env.EMAIL_TO,
        _msg: wallet,
      };
      logger.info(msgResponse);
      await Promise.all([
        sendCheckinEMail(true, msg, process.env.EMAIL_TO),
        sendMsgToKafka(constructLog(msgResponse)),
      ]);
      return Response.json({ msg });
    }
    // 检查签到时长是否到达上限
    // 超过600分钟上限还是会弹窗
    const _msg = JSON.parse(list[0].msg);
    if (_msg["over_num"] > 0) {
      const msg = `获取签到情况成功！当前免费时长已经达到上限！接口返回签到情况为${
        list[0].msg
      }
        您目前的免费时长为:${free_time} 分钟。
        超过上限时长为:${_msg["over_num"] ?? over_freetime} 分钟。`;
      const msgResponse: messageType = {
        msg: "over num",
        _msg: [wallet, _msg],
        user: process.env.EMAIL_TO,
      };
      if (_msg["over_num"] < 15) {
        // 对于还差0-14min就达到600min情况，还需要确认签到
        await Promise.all(list.map(({ id }) => AckNotification(headers, id)));
      }
      logger.info(msgResponse);
      await Promise.all([
        sendCheckinEMail(true, msg, process.env.EMAIL_TO),
        sendMsgToKafka(constructLog(msgResponse)),
      ]);
      return Response.json({ msg });
    }
    // 按照对应提醒列表ID进行确认签到
    await Promise.all(list.map(({ id }) => AckNotification(headers, id)));
    logger.info({ msg: "success", user: process.env.EMAIL_TO });
    await Promise.all([
      sendCheckinEMail(true, "success", process.env.EMAIL_TO),
      sendMsgToKafka(
        constructLog({ msg: "success", user: process.env.EMAIL_TO })
      ),
    ]);
    return Response.json({ msg: "success", date: getShanghaiDate() });
  } catch (error: any) {
    logger.error(error);
    await Promise.all([
      sendCheckinEMail(
        false,
        JSON.stringify(error?.message),
        process.env.EMAIL_TO ?? ""
      ),
      sendMsgToKafka(
        constructLog(
          {
            msg: JSON.stringify(error?.message),
            user: process.env.EMAIL_TO ?? "",
          },
          "error"
        )
      ),
    ]);
    return Response.json(
      {
        msg: JSON.stringify(error),
        date: getShanghaiDate(),
      },
      { status: 500 }
    );
  }
}
