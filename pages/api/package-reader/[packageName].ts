import type { NextApiRequest, NextApiResponse } from "next";
import { readPackageDetails } from "../../../services/PackageReader";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        name: string;
        version: string;
        description?: string;
        depends?: string[];
        dependant?: string[];
      }
    | string
  >
) {
  const { packageName } = req.query;

  const results = await readPackageDetails(packageName.toString());
  if (!results) {
    res.status(500).send("Failed to load package details!");
  } else {
    res.status(200).json(results);
  }
}
