import type { NextPage } from "next";
import { useEffect, useState } from "react";
import PackageList, { PackageItem } from "../components/PackageList";

const Home: NextPage = () => {
  const [data, setData] = useState<PackageItem[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://klau-package-viewer-backend.herokuapp.com/package-reader/api")
      .then((data) => data.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (data.length === 0) return <div>NO data found!</div>;

  return <PackageList items={data}></PackageList>;
};

export default Home;
