import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import PackageDetails from "../../components/PackageDetails";
import { listPackageNames, readPackageDetails } from "../api/services/PackageReader";

// Comment: Any particular reason why you used /pages/[packageName]/index.tsx instead of /pages/[packageName].tsx?

type PackageDetailsProps = {
    name: string,
    version: string,
    description?: string,
    depends?: string[],
    dependant?: string[]
}

// Comment: "protip": you can hierarchically destructure things with ({packageDetails:{name,version,description,depends,dependant}})
const PackageDetailsPage: NextPage<{ packageDetails: PackageDetailsProps }> = (props) => {

    return (
        // Comment: I think I get why you chose to do it like this, but pragmatically, in this case, I would've just inlined everything in here. There's a fine balance between fewer files vs shorter files
        // add content for a single package
        <PackageDetails
            name={props.packageDetails.name}
            version={props.packageDetails.version}
            description={props.packageDetails.description}
            depends={props.packageDetails.depends}
            dependant={props.packageDetails.dependant}
        ></PackageDetails>
    );
}

// Comment: What is getStaticPaths?
// Comment: Also, it would be great if we could parse this file only once, and cache the results in-memory
export const getStaticPaths: GetStaticPaths = async () => {

    const packages = await listPackageNames();

    return {
        paths: packages.map(pckg => ({ params: { packageName: pckg.name } })),
        fallback: false
    }
}

// Comment: Clever use of the getStaticProps! I learned something myself. At some point this should be converted to a REST call (protip: api routes).
// Comment: Also, it would be great if we could parse this file only once, and cache the results in-memory
export const getStaticProps: GetStaticProps = async (context) => {
    // fetch data from an API
    const packageName = context.params?.packageName;
    const packageDetails: PackageDetailsProps = await readPackageDetails(packageName!.toString()) // Comment: Nice, I think in this particular case, the use of the `!` operator is completely justified

    return {
        props: {
            packageDetails: packageDetails
        },
        revalidate: 1
    }
}

export default PackageDetailsPage;