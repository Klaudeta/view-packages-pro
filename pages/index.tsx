import type { GetStaticPaths, NextPage } from 'next'
import PackageList from '../components/PackageList'
import { listPackageNames } from "./api/services/PackageReader";

const DUMMY_PACKAGE_LIST = [
  {
    name: "python-pkg-resources",
    version: "0.6.24-1ubuntu1"
  },
  {
    name: "tcpd",
    version: "1:2.4.0-5"
  }
]

const Home: NextPage<{packageList: {name: string, version: string}[]}> = (props) => {
  return (
    <PackageList items={props.packageList}></PackageList>
  )
}


export const getStaticProps = async () => {
  // fetch data from an API

  const packageNames = await listPackageNames();

  return {
    props: {
      packageList: packageNames
    },
    revalidate: 1
  }  
}

export default Home;
