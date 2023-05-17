export type Category = {
  name?: string;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
};
export interface Channel {
  id: string;
  channel_id: string;
  title: string;
  username: string;
  type: string;
  active_usernames: any;
  description: string;
  avatar: any;
  created_at: any;
  updated_at: any;
  deleted_at: any;
  subscription: number;
  last_updated_at: any;
  category_id: string;
  country_id: number;
  channel_lang: string;
  is_bot_connect: any;
  connected_bot_id: any;
  access_hash: any;
  counter: {
    today: number;
    total: number;
  };
  category: {
    id: string;
    name: string;
    created_at: any;
    updated_at: any;
    deleted_at: any;
  };
  country: {
    id: number;
    iso: string;
    name: string;
    nicename: string;
    iso3: string;
    numcode: number;
    phonecode: number;
    deleted_at: any;
  };
  language: {
    id: string;
    value: string;
    deleted_at: any;
  };
}
export type MultiValueOptions = {
  value: any;
  label: any;
};
export type BoardType = {
  id: number;
  name: string;
  title: string;
  list_level: number;
  read_level: number;
  write_level: number;
  comment_level: number;
  upload_level: number;
  download_level: number;
  html_level: number;
  new_duration: number;
  hot_low: number;
  count_delete: number;
  count_modify: number;
  created_at: date;
  updated_at: date;
  deleted_at: date | null;
  category_total: number;
  post_total: number;
  comment_total: number;
};
export type PostType = {
  id: number;
  title: string;
  reaction: null | number;
  views: number;
  comment: number;
  board_id: number;
  created_at: timestamp;
  updated_at: timestamp;
  extra_01: null;
  extra_02: null;
  extra_03: null;
  extra_04: null;
  extra_05: null;
  extra_06: null;
  extra_07: null;
  extra_08: null;
  extra_09: null;
  extra_10: null;
  user: {
    id: number;
    nickname: string;
  };
  board: {
    id: number;
    name: string;
    title: string;
    list_level: number;
    read_level: number;
    write_level: number;
    comment_level: number;
    upload_level: number;
    download_level: number;
    html_level: number;
    new_duration: number;
    hot_low: number;
    count_delete: number;
    count_modify: number;
    created_at: timestamp;
    updated_at: timestamp;
  };
  category: {
    id: number;
    category: string;
  };
};
