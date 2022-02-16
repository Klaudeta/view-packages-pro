import Link from "next/link";
import sharedClasses from "./Package.module.css";
import classes from "./PackageDetails.module.css";

const PackageDetails: React.FC = () => {
    return (
        <div>
            <header className={sharedClasses.header}>
                <div className={sharedClasses.logo}>Package Viewer</div>
                <Link href='/' >
                    <span className={classes.back}>
                        Back to package list
                    </span>
                </Link>
            </header>
            Package details goes here
        </div>
    );
}

export default PackageDetails;