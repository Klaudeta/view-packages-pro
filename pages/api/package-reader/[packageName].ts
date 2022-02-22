import type { NextApiRequest, NextApiResponse } from "next";
import { readPackageDetails } from "../../../services/PackageReader";

export type PackageDetailsResult = {
  name: string;
  version: string;
  description?: string;
  depends?: string[];
  dependant?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PackageDetailsResult>
) {
  const { packageName } = req.query;
  res.status(200).json(await readPackageDetails(packageName.toString()));
}
