import type { NextPage } from "next";
import { useEffect, useState } from "react";
import PackageList from "../components/PackageList";

const Home: NextPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/package-reader")
      .then((data) => data.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>NO data found!</div>;

  return <PackageList items={data}></PackageList>;
};

export default Home;
