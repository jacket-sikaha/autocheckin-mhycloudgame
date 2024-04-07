import logger from "@/logger/winston-config";
import { NotificationResponse, WalletResponseData } from "./type";

export const ListNotificationURL =
  "https://api-cloudgame.mihoyo.com/hk4e_cg_cn/gamer/api/listNotifications?is_sort=true&source=NotificationSourceUnknown&status=NotificationStatusUnread&type=NotificationTypePopup";
export const AckNotificationURL =
  "https://api-cloudgame.mihoyo.com/hk4e_cg_cn/gamer/api/ackNotification";
export const WalletURL =
  "https://api-cloudgame.mihoyo.com/hk4e_cg_cn/wallet/wallet/get?cost_method=COST_METHOD_UNSPECIFIED";
export const AnnouncementURL =
  "https://api-cloudgame.mihoyo.com/hk4e_cg_cn/gamer/api/getAnnouncementInfo";
// Here must be an earlier version so that the response won't be null
export const AppVersionURL =
  "https://api-takumi.mihoyo.com/ptolemaios/api/getLatestRelease?app_id=1953443910&app_version=3.8.0&channel=mihoyo";

export const ListNotification = async (headers: any) => {
  const tmp = await fetch(ListNotificationURL, {
    headers,
  });
  const res: NotificationResponse = await tmp.json();
  return res.data ? res.data.list : null;
};

export const AckNotification = async (headers: any, id: any) => {
  const tmp = await fetch(AckNotificationURL, {
    method: "post",
    body: JSON.stringify({ id }),
    headers,
  });
  return await tmp.json();
};

export const Wallet = async (headers: any) => {
  const tmp = await fetch(WalletURL, {
    headers,
  });
  const res: WalletResponseData = await tmp.json();
  return res.data;
};

export const AppVersion = async () => {
  const tmp = await fetch(AppVersionURL);
  const res: { data: { package_version: string } } = await tmp.json();
  return res.data.package_version;
};

export const makeHeader = (appversion: string) => {
  if (
    !process.env.X_RPC_COMBO_TOKEN ||
    !process.env.X_RPC_CLIENT_TYPE ||
    !process.env.X_RPC_SYS_VERSION ||
    !process.env.X_RPC_DEVICE_ID ||
    !process.env.X_RPC_DEVICE_NAME ||
    !process.env.X_RPC_DEVICE_MODEL
  ) {
    logger.error({
      msg: "mhy相关配置参数不能为空",
      config: {
        "x-rpc-combo_token": process.env.X_RPC_COMBO_TOKEN,
        "x-rpc-client_type": process.env.X_RPC_CLIENT_TYPE,
        "x-rpc-sys_version": process.env.X_RPC_SYS_VERSION,
        "x-rpc-device_id": process.env.X_RPC_DEVICE_ID,
        "x-rpc-device_name": process.env.X_RPC_DEVICE_NAME,
        "x-rpc-device_model": process.env.X_RPC_DEVICE_MODEL,
      },
    });
    throw new Error("mhy相关配置参数不能为空");
  }
  return {
    "x-rpc-app_id": 4,
    "x-rpc-combo_token": process.env.X_RPC_COMBO_TOKEN,
    "x-rpc-client_type": process.env.X_RPC_CLIENT_TYPE,
    "x-rpc-app_version": appversion,
    "x-rpc-sys_version": process.env.X_RPC_SYS_VERSION,
    "x-rpc-channel": "mihoyo",
    "x-rpc-device_id": process.env.X_RPC_DEVICE_ID,
    "x-rpc-device_name": process.env.X_RPC_DEVICE_NAME,
    "x-rpc-device_model": process.env.X_RPC_DEVICE_MODEL,
    "x-rpc-vendor_id": "2",
    "x-rpc-cg_game_biz": "hk4e_cn",
    "x-rpc-op_biz": "clgm_cn",
    "x-rpc-language": "zh-CN,zh;q=0.9",
    Host: "api-cloudgame.mihoyo.com",
    Connection: "Keep-Alive",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  };
};
