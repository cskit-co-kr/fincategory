import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return getSubs();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getSubs() {
    let data: any[] | null = [];

    const responseSub = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getSubsHistory`,
      { id: req.body.username }
    );
    const responseData = await responseSub.data;

    data = responseData?.map((item: any) => {
      const date = new Date(item.created_at);
      const formattedDate = date.toLocaleDateString(
        req.body.locale === "ko" ? "ko-KR" : "en-US",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
      return {
        name: formattedDate,
        sub: item.count,
      };
    });

    if (responseSub.status === 200) {
      res.status(200).json(data);
    } else {
      res.status(responseSub.status).json(data);
    }
  }
}
