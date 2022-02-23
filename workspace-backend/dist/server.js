"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const body_parser_1 = require("body-parser");
const PackageReader_1 = require("./services/PackageReader");
const getPackageList = async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.status(200).json(await (0, PackageReader_1.listPackageNames)());
};
const getPackageDetails = async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    const { packageName } = req.params;
    res.status(200).json(await (0, PackageReader_1.readPackageDetails)(packageName.toString()));
};
const router = (0, express_1.Router)();
router.get("/package-reader/api/", getPackageList);
router.get("/package-reader/api/:packageName", getPackageDetails);
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use(router);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
app.listen(3001);
