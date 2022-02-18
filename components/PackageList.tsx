import Link from "next/link";
import { useState } from "react";
import sharedClasses from "./Package.module.css";
import classes from "./PackageList.module.css";


type PackageListProps = {
    items: { name: string, version: string }[]
}

const PackageList: React.FC<PackageListProps> = ({ items }) => {
    const [packageList, setPackageList] = useState(items);

    const onChange = (e: React.FormEvent<HTMLInputElement>) =>
        setPackageList(items.filter(item => item.name.includes(e.currentTarget.value)))

    return (
        <div>
            <header className={sharedClasses.header}>
                <div className={sharedClasses.logo}>Package Viewer</div>
                <input type="text" placeholder="Search packages" className={classes.search} onChange={onChange}></input>
            </header>
            <ul className={classes.packagesul}>
                {packageList.map(item => (
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

    )
}

export default PackageList;