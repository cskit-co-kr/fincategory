export type Category = {
    name?: string;
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: null;
}
export type Channel = {
    id: string,
    channel_id: string,
    title: string,
    username: string,
    type: string,
    description: string,
    avatar: string,
    created_at: string,
    updated_at: string,
    subscription: string,
    last_updated_at: string,
    category_id: string,
    country_id: string,
    channel_lang: string,
}
export type MultiValueOptions = {
    value: any,
    label: any,
}