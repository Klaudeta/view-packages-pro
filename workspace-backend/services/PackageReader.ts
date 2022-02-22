import * as fs from "fs/promises";
import * as path from "path";

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

const packageStatusFile =
  process.env.PACKAGE_STATUS_FILE ||
  path.resolve("./services", "packages.status");

const packageFileContent = fs.readFile(packageStatusFile).then((doc) => {
  console.log("Reading");
  return doc.toString();
});

const searchableField: (fieldName: string) => string = (fieldName) =>
  fieldName + ": ";

const readSimpleFieldFromParagraph: (
  packageParagraph: string,
  fieldName: string
) => string = (packageParagraph, fieldName) => {
  const _fieldName = searchableField(fieldName);

  const [fieldValue] = packageParagraph
    .split(fieldLineDelimiter)
    .filter((line) => line.startsWith(_fieldName))
    .map((line) => line.replace(_fieldName, ""));

  return fieldValue ?? "";
};

const readMultiLineFieldFromParagraph: (
  packageParagraph: string,
  fieldName: string
) => string = (packageParagraph, fieldName) => {
  const fieldValue = searchableField(fieldName);
  var regex = new RegExp(fieldValue + "[\\s\\S]*?(\\n\\S)", "m");
  var result = packageParagraph.match(regex);
  if (result) {
    return result[0].replace(result[1], "").replace(fieldValue, "");
  } else {
    return "";
  }
};

const readRelationshipFieldFromParagraph: (
  packageParagraph: string,
  fieldName: string
) => string[] = (packageParagraph, fieldName) => {
  const fieldValue = readSimpleFieldFromParagraph(packageParagraph, fieldName);
  if (fieldValue) {
    return fieldValue
      .toString()
      .replace(/ *\([^)]*\) */g, "")
      .split(", ");
  } else {
    return [];
  }
};

const readReverseRelationshipField: (
  document: string,
  fieldName: string,
  packageName: string
) => string[] = (document, fieldName, packageName) => {
  const readRelationshipField = (paragraph: string) =>
    readRelationshipFieldFromParagraph(paragraph, fieldName);
  const readSimpleField = (paragraph: string) =>
    readSimpleFieldFromParagraph(paragraph, packageField);

  const paragraphs = document.split(paragraphDelimiter);
  return paragraphs
    .filter((p) =>
      readRelationshipField(p)?.some((pckg) => pckg === packageName)
    )
    .map((p) => readSimpleField(p)!);
};

export const listPackageNames: () => Promise<
  { name: string; version: string }[]
> = () => {
  return packageFileContent.then((doc) =>
    doc
      .split(paragraphDelimiter)
      .filter(
        (paragraph) =>
          readSimpleFieldFromParagraph(paragraph, packageField) !== undefined
      )
      .map((paragraph) => {
        const packageName = readSimpleFieldFromParagraph(
          paragraph,
          packageField
        )!;
        const version = readSimpleFieldFromParagraph(paragraph, versionField)!;
        return { name: packageName, version: version };
      })
  );
};

type PackageDetails = {
  name: string;
  version: string;
  description?: string;
  depends?: string[];
  dependant?: string[];
};

export const readPackageDetails: (
  packageName: string
) => Promise<PackageDetails> = async (packageName) => {
  return packageFileContent.then(
    (doc) =>
      doc
        .split(paragraphDelimiter)
        .filter(
          (paragraph) =>
            readSimpleFieldFromParagraph(paragraph, packageField) ===
            packageName
        )
        .map((paragraph) => {
          return {
            name: readSimpleFieldFromParagraph(paragraph, packageField),
            version: readSimpleFieldFromParagraph(paragraph, versionField),
            description: readMultiLineFieldFromParagraph(
              paragraph,
              descriptionField
            ),
            depends: readRelationshipFieldFromParagraph(
              paragraph,
              dependsField
            ),
            dependant: readReverseRelationshipField(
              doc,
              dependsField,
              packageName
            ),
          };
        })[0]
  );
};
