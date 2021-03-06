import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PackageDetails, {
  PackageDetailsProp,
} from "../components/PackageDetails";

const PackageDetailsPage: NextPage = () => {
  const router = useRouter();

  const [data, setData] = useState<PackageDetailsProp>();
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
    setLoading(true);
    if (router.query.packageName) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/package-reader/api/${router.query.packageName}`
      )
        .then((data) => data.json())
        .then(setData)
        .finally(() => setLoading(false));
    } else {
      setError("No package selected");
      setLoading(false);
    }
  }, [router.query.packageName]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>No package details found!</div>;

  const { name, version, description, depends, dependant } = data;

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
};

export default PackageDetailsPage;
