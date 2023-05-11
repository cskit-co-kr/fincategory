import axios from "axios";
import { InferGetServerSidePropsType, NextPage } from "next";
import { NextSeo } from "next-seo";

const Board: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const name = props.name
  return (
    <>
      <div className="flex flex-col pt-36 bg-gray-50">
        <NextSeo
          title={name}
        />
      </div>
    </>
  )
}

export const getServerSideProps = async (context: any) => {
  const name = context.query.name;
  console.log('name: ', name);
  console.log('url: ', process.env.NEXT_PUBLIC_API_URL);


  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/board/get/${name}`);

  const board = await res.data;

  console.log('board: ', board);
  
  return {
    props: { name }
  }

}

export default Board;