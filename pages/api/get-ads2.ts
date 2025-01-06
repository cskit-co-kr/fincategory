import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const locale = req.body.locale;
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/product/getProductActiveSection2`,
    { locale }
  );
  const result = await response.data;
  res.status(200).json(result.rows);
}
