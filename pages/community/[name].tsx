import axios from "axios";
import { InferGetServerSidePropsType, NextPage } from "next";
import { NextSeo } from "next-seo";

const Board: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const name = props.name
  return (
    <>
      <NextSeo
        title={name}
      />
      <div className="grid grid-cols-12">
        <div className="col-span-3">Left side</div>
        <div className="col-span-9">Right Side</div>
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