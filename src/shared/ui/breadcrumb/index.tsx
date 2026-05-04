import { type JSX, type ReactNode, useMemo } from "react";
import { Link, useMatches } from "react-router-dom";
import "./Breadcrumb.scss";

interface RouteProps {
    breadCrumb?: string;
    disabled?: boolean;
}

export function Breadcrumb() {
    const matches = useMatches();

    const activeBreadcrumbs = useMemo<JSX.Element[]>(() => {
        const breadCrumbs: JSX.Element[] = [];

        for (let index = 0; index < matches.length; index++) {
            const match = matches[index];
            const handle = match?.handle as RouteProps | undefined;

            const routeTo = match?.pathname || "/";
            const breadCrumbTitle = handle?.breadCrumb;
            const isDisabled = handle?.disabled;

            if (breadCrumbTitle) {
                if (index === matches.length - 1) {
                    breadCrumbs.push(
                        <BreadCrumbElement key={breadCrumbTitle} disabled={isDisabled} isActive={true} route={routeTo}>
                            {breadCrumbTitle}
                        </BreadCrumbElement>,
                    );
                    break;
                }

                breadCrumbs.push(
                    <BreadCrumbElement key={breadCrumbTitle} disabled={isDisabled} route={routeTo}>
                        {breadCrumbTitle} /
                    </BreadCrumbElement>,
                );
            }
        }

        return breadCrumbs;
    }, [matches]);

    return <ol className='breadcrumb'>{activeBreadcrumbs}</ol>;
}

export const BreadCrumbElement = function ({
    children,
    disabled,
    route,
    isActive,
}: {
    children: ReactNode;
    disabled?: boolean;
    route: string;
    isActive?: boolean;
}) {
    const className = isActive ? "breadcrumb-option active" : "breadcrumb-option";

    return (
        <>
            {disabled ? (
                <div className={className}>
                    <div>{children}</div>
                </div>
            ) : (
                <Link className={className} to={route}>
                    <div className='flex align-center'>{children}</div>
                </Link>
            )}
        </>
    );
};

export type BreadcrumbDetails = {
    breadCrumbTitle: string;
    routeTo: string;
};