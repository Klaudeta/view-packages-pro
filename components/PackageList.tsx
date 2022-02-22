import Link from "next/link";
import { useState } from "react";
import sharedClasses from "./Package.module.css";
import classes from "./PackageList.module.css";

export type PackageItem = { name: string; version: string };

type PackageListProps = {
  items: PackageItem[];
};

const PackageList: React.FC<PackageListProps> = ({ items }) => {
  const [filter, setFilter] = useState("");
  console.log(`Rendering PackageList with fitler ${filter}`);

  const onChange = (e: React.FormEvent<HTMLInputElement>) =>
    setFilter(e.currentTarget.value);

  const packageList = filter
    ? items.filter(({ name }) => name.includes(filter))
    : items;

  return (
    <div>
      <header className={sharedClasses.header}>
        <div className={sharedClasses.logo}>Package Viewer</div>
        <input
          type="text"
          placeholder="Search packages"
          className={classes.search}
          onChange={onChange}
        ></input>
      </header>
      <ul className={classes.packagesul}>
        {packageList.map((item) => (
          <Link href={`/${item.name}`} key={item.name} passHref>
            <a>
              <li className={classes.packageli}>
                <span>{item.name}</span>
                <span>{item.version}</span>
              </li>
            </a>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default PackageList;
