import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import useSwr from "swr";
import PackageDetails from "../components/PackageDetails";

type PackageDetailsProps = {
    name: string,
    version: string,
    description?: string,
    depends?: string[],
    dependant?: string[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const PackageDetailsPage: NextPage = () => {

    const router = useRouter()
    const { data, error } = useSwr(
        router.query.packageName ? `/api/package-reader/${router.query.packageName}` : null,
        fetcher
    )

    if (error) return <div>Failed to load package details</div>
    if (!data) return <div>Loading...</div>

    console.log(data);

    const {
        name,
        version,
        description,
        depends,
        dependant
    } = data

    return (
        // add content for a single package
        <PackageDetails
            name={name}
            version={version}
            description={description}
            depends={depends}
            dependant={dependant}
        ></PackageDetails>
    );
}

export default PackageDetailsPage;