import { createContext, useState, useContext } from 'react';

interface IDataContext {
  sideBar: boolean;
  posts: any[];
  toggleSideBar: (status: boolean) => void;
  savePosts: (posts: any[]) => void;
  getPosts: (username: string) => any;
}

const ActionContext = createContext<IDataContext>({
  sideBar: false,
  posts: [],
  toggleSideBar: () => {},
  savePosts: () => {},
  getPosts: (username: string) => {}
});

export const useData = () => useContext(ActionContext);

export const DataProvider = (props: any) => {
  const [sideBar, setSideBar] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const toggleSideBar = (status: boolean) => {
    setSideBar(status);
  };


  const savePosts = (posts: any[]) => {
    console.log(posts, "saved");
    setPosts(posts)
  }
  const getPosts = (username: string) => {
    console.log("posts: ", posts);
    return posts.map((post => {
      if(post.username === username){
        return post;
      }
    }))
  }
  return <ActionContext.Provider value={{ sideBar, toggleSideBar, savePosts, posts, getPosts }}>{props.children}</ActionContext.Provider>;
};
