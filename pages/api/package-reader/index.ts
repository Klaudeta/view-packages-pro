import type { NextApiRequest, NextApiResponse } from "next";
import { listPackageNames } from "../../../services/PackageReader";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ name: string; version: string }[]>
) {
  res.status(200).json(await listPackageNames());
}
