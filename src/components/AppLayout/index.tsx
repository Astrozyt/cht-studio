import { Link, Outlet, useLocation } from "react-router";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";

const AppLayout = () => {
    const breadCrumbs = useLocation().pathname.split("/").filter((crumb) => crumb !== "");
    { console.log("br", breadCrumbs) }
    return (
        <>
            <header className="app-header grid bg-blue-100 grid-cols-12 grid-rows-3 h-12">
                <h1 className="col-start-2 col-end-4 row-start-2">CHT Studio</h1>
                {breadCrumbs.length > 0 && <Breadcrumb className="row-start-2 col-start-5">
                    <BreadcrumbList className="flex-nowrap">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        {breadCrumbs.map((crumb, index) => {
                            const path = `/${breadCrumbs.slice(0, index + 1).join("/")}`;
                            return index + 1 === breadCrumbs.length ?
                                <BreadcrumbItem key={path + index}>
                                    {crumb}
                                </BreadcrumbItem> :
                                <>
                                    <BreadcrumbItem key={path + 2 + index}>
                                        <Link to={path}>{crumb}</Link>
                                    </BreadcrumbItem>
                                    {index < breadCrumbs.length - 1 && <BreadcrumbSeparator />}
                                </>
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
                }
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}
export default AppLayout;

// display: grid
// ;
// grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
// grid-template-rows: 1fr 1fr 1fr;
// height: 5rem;