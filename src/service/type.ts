export type mhyNotification = {
  id: string;
  status: string;
  type: string;
  priority: number;
  source: string;
  desc: string;
  msg: string;
  created_at: string;
};

export type NotificationResponse = {
  retcode: number;
  message: string;
  data: { list: mhyNotification[] } | null;
};

export type WalletResponseData = {
  retcode: number;
  message: string;
  data?: {
    coin: {
      coin_num: string;
      free_coin_num: string;
      coin_limit: string;
      exchange: string;
    };
    free_time: FreeTime;
    status: Status;
    total_time: string;
    stat: { vip_point: string };
    play_card: {
      expire: string;
      msg: string;
      short_msg: string;
      play_card_limit: string;
    };
  };
};

export type FreeTime = {
  send_freetime: string;
  free_time: string;
  free_time_limit: string;
  over_freetime: string;
};

export type Status = {
  status: number;
  msg: string;
  total_time_status: number;
  status_new: number;
};
