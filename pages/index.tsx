import type { NextPage } from 'next'
import PackageList from '../components/PackageList'

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

const Home: NextPage = () => {
  return (
    <PackageList items={DUMMY_PACKAGE_LIST}></PackageList>
  )
}

export default Home;
