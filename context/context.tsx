import { createContext, useState, useContext } from 'react';

interface IDataContext {
  posts: any[];
  savePosts: (posts: any[]) => void;
  getPosts: (username: string) => any;
}

const ActionContext = createContext<IDataContext>({
  posts: [],
  savePosts: () => {},
  getPosts: (username: string) => {},
});

export const useData = () => useContext(ActionContext);

export const DataProvider = (props: any) => {
  const [posts, setPosts] = useState<any[]>([]);

  const savePosts = (posts: any[]) => {
    console.log(posts, 'saved');
    setPosts(posts);
  };
  const getPosts = (username: string) => {
    console.log('posts: ', posts);
    return posts.map((post) => {
      if (post.username === username) {
        return post;
      }
    });
  };
  return <ActionContext.Provider value={{ savePosts, posts, getPosts }}>{props.children}</ActionContext.Provider>;
};
