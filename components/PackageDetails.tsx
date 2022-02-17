import Link from "next/link";
import sharedClasses from "./Package.module.css";
import classes from "./PackageDetails.module.css";

type PackageDetailsProp = {
    name: string,
    version: string,
    description?: string,
    depends?: string[],
    dependant?: string[]
}

/* Comment: A common pattern is to destructure the properties, so it would be 
const PackageDetails: React.FC<PackageDetailsProp> = ({name, version, ...}) => {
*/
const PackageDetails: React.FC<PackageDetailsProp> = (props) => {
    return (
        <div>
            <header className={sharedClasses.header}>
                <div className={sharedClasses.logo}>Package Details</div>
                <Link href='/' >
                    <span className={classes.back}>
                        Back to package list
                    </span>
                </Link>
            </header>

            <table className={classes.details}>
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td>{props.name}</td>
                    </tr>
                    <tr>
                        <td>Version</td>
                        <td>{props.version}</td>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td>{props.description}</td>
                    </tr>
                    <tr>
                        <td>Depends</td>
                        <td>{props.depends?.join(', ')}</td>
                    </tr>
                    <tr>
                        <td>Dependent</td>
                        <td>{props.dependant?.join(', ')}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default PackageDetails;