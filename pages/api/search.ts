// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | Array<{
      domain: string;
      available: boolean;
      premium: boolean;
    }>
  | {
      error: string;
    };

var client = require("dnsimple")({
  baseUrl: "https://api.dnsimple.com",
  accessToken: process.env.DNSIMPLE_ACCESS_TOKEN,
});

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { q } = req.query;

  try {
    const { data } = await client.registrar.checkDomain(
      process.env.DNSIMPLE_ACCOUNT_ID,
      q
    );

    res.json([data]);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({
      error: e.message,
    });
  }
};
