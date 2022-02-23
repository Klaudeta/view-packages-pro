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
exports.readPackageDetails = exports.listPackageNames = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
/**
 * Reads information from a file which adhere to control file format of Debian Policy.
 * The provided control file should be organized in paragraph where each paragraph
 * represents a package information. Paragraphs are separated from each other from a empty new line.
 *
 * Within a paragraph information is organized in (field, value) pairs. Lines within the paragraph start
 * with the name of the field a column, space and then the values.
 * Simple fields have their value within the same line, while folded and multiline fields, have their value span multiple lines
 * The addional lines of a multiline field start with a whitespace.
 *
 * The class deals with the relationship fields in a different way by giving the posibility to remove versions
 * from the list of pakckages contained in the value of relationship fields.
 *
 *
 */
const paragraphDelimiter = "\n\n";
const fieldLineDelimiter = "\n";
const packageField = "Package";
const versionField = "Version";
const descriptionField = "Description";
const dependsField = "Depends";
const packageStatusFile = process.env.PACKAGE_STATUS_FILE ||
    path.resolve("./services", "packages.status");
const packageFileContent = fs.readFile(packageStatusFile).then((doc) => {
    console.log("Reading");
    return doc.toString();
});
const searchableField = (fieldName) => fieldName + ": ";
const readSimpleFieldFromParagraph = (packageParagraph, fieldName) => {
    const _fieldName = searchableField(fieldName);
    const [fieldValue] = packageParagraph
        .split(fieldLineDelimiter)
        .filter((line) => line.startsWith(_fieldName))
        .map((line) => line.replace(_fieldName, ""));
    return fieldValue !== null && fieldValue !== void 0 ? fieldValue : "";
};
const readMultiLineFieldFromParagraph = (packageParagraph, fieldName) => {
    const fieldValue = searchableField(fieldName);
    var regex = new RegExp(fieldValue + "[\\s\\S]*?(\\n\\S)", "m");
    var result = packageParagraph.match(regex);
    if (result) {
        return result[0].replace(result[1], "").replace(fieldValue, "");
    }
    else {
        return "";
    }
};
const readRelationshipFieldFromParagraph = (packageParagraph, fieldName) => {
    const fieldValue = readSimpleFieldFromParagraph(packageParagraph, fieldName);
    if (fieldValue) {
        return fieldValue
            .toString()
            .replace(/ *\([^)]*\) */g, "")
            .split(", ");
    }
    else {
        return [];
    }
};
const readReverseRelationshipField = (document, fieldName, packageName) => {
    const readRelationshipField = (paragraph) => readRelationshipFieldFromParagraph(paragraph, fieldName);
    const readSimpleField = (paragraph) => readSimpleFieldFromParagraph(paragraph, packageField);
    const paragraphs = document.split(paragraphDelimiter);
    return paragraphs
        .filter((p) => { var _a; return (_a = readRelationshipField(p)) === null || _a === void 0 ? void 0 : _a.some((pckg) => pckg === packageName); })
        .map((p) => readSimpleField(p));
};
const listPackageNames = () => {
    return packageFileContent.then((doc) => doc
        .split(paragraphDelimiter)
        .filter((paragraph) => readSimpleFieldFromParagraph(paragraph, packageField) !== undefined)
        .map((paragraph) => {
        const packageName = readSimpleFieldFromParagraph(paragraph, packageField);
        const version = readSimpleFieldFromParagraph(paragraph, versionField);
        return { name: packageName, version: version };
    }));
};
exports.listPackageNames = listPackageNames;
const readPackageDetails = async (packageName) => {
    return packageFileContent.then((doc) => doc
        .split(paragraphDelimiter)
        .filter((paragraph) => readSimpleFieldFromParagraph(paragraph, packageField) ===
        packageName)
        .map((paragraph) => {
        return {
            name: readSimpleFieldFromParagraph(paragraph, packageField),
            version: readSimpleFieldFromParagraph(paragraph, versionField),
            description: readMultiLineFieldFromParagraph(paragraph, descriptionField),
            depends: readRelationshipFieldFromParagraph(paragraph, dependsField),
            dependant: readReverseRelationshipField(doc, dependsField, packageName),
        };
    })[0]);
};
exports.readPackageDetails = readPackageDetails;
