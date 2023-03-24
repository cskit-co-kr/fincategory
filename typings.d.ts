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
