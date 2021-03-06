import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  Router,
} from "express";
import cors from "cors";

import { json } from "body-parser";
import { listPackageNames, readPackageDetails } from "./services/PackageReader";

const getPackageList: RequestHandler = async (req, res, next) => {
  res.status(200).json(await listPackageNames());
};

const getPackageDetails: RequestHandler<{
  packageName: string;
}> = async (req, res, next) => {
  const { packageName } = req.params;
  res.status(200).json(await readPackageDetails(packageName.toString()));
};

const router = Router();
router.get("/package-reader/api/", getPackageList);
router.get("/package-reader/api/:packageName", getPackageDetails);

const app = express();

app.use(cors());
app.use(json());

app.use(router);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT || 3001);
