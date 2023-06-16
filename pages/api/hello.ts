// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// const { Api, TelegramClient } = require('telegram');
// const { StringSession } = require('telegram/sessions');

// const apiId = 22710080;
// const apiHash = '7276ae9635cca9ee3d2aa4e4fd434c22';

// const session = new StringSession(
//   '1BQANOTEuMTA4LjU2LjEyNgG7oWt2SzcDXZ/wl3OAIBwNE30OTcDs9QCQzBKlJKf3is0GPR+r6FT7gPs3R9Un4rzaMqHEhx4dSuS9RKibTw4vfjgDn55+/D6w9elj3uYMx5cz7qKux+5wPgzByYpTko8oeKeaPeriBQVqhnlg7B9WoiDHmYRfcTiJ4f0IL3lugk2IoklZc9DyyEd7wJ2p0yjYe687S7WWpYF7hTWnrfygvIjdk/NUvx52DV1Yxm3BpnVbFHn2P7qfUNCReQaeQCUFFK1v6OLKaU6Iq1adfx3ZlzeRVM4wIcjxSDSbyxIgZPEr+IicLy4FSfcvXFClrZU8l82TJpy8nGeqsX5GoaNXSA=='
// );
// const client = new TelegramClient(session, apiId, apiHash, {});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // async function getHistory() {
  //   await client.connect();

  //   const result = await client.invoke(
  //     new Api.messages.GetHistory({
  //       peer: 'fireantcrypto',
  //       offsetId: 0,
  //       offsetDate: 0,
  //       addOffset: 0,
  //       limit: 1,
  //       maxId: 0,
  //       minId: 0,
  //       hash: BigInt('-4156887774564'),
  //     })
  //   );

  //   console.log(result.messages);
  //   await client.disconnect();
  // }
  // getHistory();

  res.status(200).json('data');
}
