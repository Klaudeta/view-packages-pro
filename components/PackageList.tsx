import Link from "next/link";
import { useState } from "react";
import sharedClasses from "./Package.module.css";
import classes from "./PackageList.module.css";


type PackageListProps = {
    items: { name: string, version: string }[]
}

const PackageList: React.FC<PackageListProps> = (props) => {
    const [packageList, setPackageList] = useState(props.items as { name: string, version: string }[]);
    
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;
        setPackageList(props.items.filter(item => item.name.includes(newValue)));
    }
    
    return (
        <div>
            <header className={sharedClasses.header}>
                <div className={sharedClasses.logo}>Package Viewer</div>
                <input type="text" placeholder="Search packages" className={classes.search} onChange= {onChange}></input>
            </header>
            <ul className={classes.packagesul}>
                {packageList.map(item => (
                    <Link href={`/${item.name}`} key={item.name} >
                        <li className={classes.packageli}>
                            <span>{item.name}</span>
                            <span>{item.version}</span>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>

    )
}

export default PackageList;