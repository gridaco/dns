import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

var client = require("dnsimple")({
  baseUrl: "https://api.dnsimple.com",
  accessToken: process.env.DNSIMPLE_ACCESS_TOKEN,
});

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // 2592000 = a month
  res.setHeader("Cache-Control", "public, max-age=2592000");

  try {
    const data = await client.tlds.allTlds();

    res.json(data);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({
      error: e.message,
    });
  }
};
