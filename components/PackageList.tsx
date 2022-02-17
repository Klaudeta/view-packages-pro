import Link from "next/link";
import sharedClasses from "./Package.module.css";
import classes from "./PackageList.module.css";


type PackageListProps = {
    items: { name: string, version: string }[]
}

const PackageList: React.FC<PackageListProps> = (props) => {
    return (
        <div>
            <header className={sharedClasses.header}>
                <div className={sharedClasses.logo}>Package Viewer</div>
                <input type="text" placeholder="Search packages" className={classes.search}></input>
            </header>
            <ul className={classes.packagesul}>
                {props.items.map(item => (
                    // Comment: Do you know why this is a warning?
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