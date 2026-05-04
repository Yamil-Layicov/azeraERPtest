import { useEffect } from "react";
import { useMatches } from "react-router-dom";


const COMPANY_SUFFIX = "Azera Holding";
const DEFAULT_TITLE = `İşlər | ${COMPANY_SUFFIX}`;

type TRouteHandle = {
    breadCrumb?: string;
    parentCrumb?: string; 
};

type TMatch = {
    handle?: TRouteHandle;
    pathname: string;
};

function useMetaTitle() {
    const matches = useMatches() as TMatch[];
    const currentRoute = matches[matches.length - 1];
    
    const pageTitle = currentRoute?.handle?.breadCrumb;
    const parentTitle = currentRoute?.handle?.parentCrumb;

    useEffect(() => {
        let title = DEFAULT_TITLE; 

        if (parentTitle) {
            title = `${parentTitle} | ${COMPANY_SUFFIX}`;
        } else if (pageTitle) {
            title = `${pageTitle} | ${COMPANY_SUFFIX}`;
        }
        
        document.title = title;

        return () => {
            document.title = DEFAULT_TITLE;
        };
    }, [pageTitle, parentTitle]); 
}

export default useMetaTitle;