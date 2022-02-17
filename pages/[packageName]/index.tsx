import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import PackageDetails from "../../components/PackageDetails";
import { listPackageNames, readPackageDetails } from "../api/services/PackageReader";

type PackageDetailsProps = {
    name: string,
    version: string,
    description?: string,
    depends?: string[],
    dependant?: string[]
}

const PackageDetailsPage: NextPage<{ packageDetails: PackageDetailsProps }> = (props) => {

    return (
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

export const getStaticPaths: GetStaticPaths = async () => {

    const packages = await listPackageNames();

    return {
        paths: packages.map(pckg => ({ params: { packageName: pckg.name } })),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    // fetch data from an API
    const packageName = context.params?.packageName;
    const packageDetails: PackageDetailsProps = await readPackageDetails(packageName!.toString())

    return {
        props: {
            packageDetails: packageDetails
        },
        revalidate: 1
    }
}

export default PackageDetailsPage;