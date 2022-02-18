import type { NextPage } from "next";
import useSwr from "swr";
import PackageList from "../components/PackageList";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Home: NextPage = () => {

  const { data, error } = useSwr("/api/package-reader",
    fetcher
  )

  if (error) return <div>Failed to load package names</div>
  if (!data) return <div>Loading...</div>

  return <PackageList items={data} ></PackageList>;
};

export default Home;
