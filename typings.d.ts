export type Category = {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
};

export type Language = {
  id: string;
  value: string;
  deleted_at: string | null;
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

export type GroupType = {
  id: number;
  name: string;
  boards: [
    {
      id: number;
      name: string;
      title: string;
    }
  ];
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
  content?: string;
  reaction: null | string;
  views: number;
  comment: number;
  board_id: number;
  created_at: timestamp;
  updated_at: timestamp;
  extra_01: string;
  extra_02: string;
  extra_03: string;
  extra_04: string;
  extra_05: string;
  extra_06: string;
  extra_07: string;
  extra_08: string;
  extra_09: string;
  extra_10: string;
  user: {
    id: number;
    nickname: string;
    username: string;
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

type CommentChildType = {
  id: number;
  comment: string;
  reaction: null;
  created_at: timestamp;
  updated_at: timestamp;
  user: {
    id: number;
    nickname: string;
  };
  child?: Array<CommentChildType>;
};

export type CommentType = {
  id: number;
  comment: string;
  reaction: null;
  created_at: timestamp;
  updated_at: timestamp;
  user: {
    id: number;
    nickname: string;
  };
  child?: Array<CommentChildType>;
};

export type MemberType = {
  code: number;
  member: {
    id: number;
    username: string;
    nickname: string;
    email: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
  };
  post: number;
  comment: number;
};
