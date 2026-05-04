import { useEffect, useState, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../../header";
import { Sidebar } from "../../sidebar";
import { useMetaTitle } from "../../../shared/lib/hooks";
import { ErrorBoundary } from "@/shared/lib/utils/ErrorBoundary";
import "./Layout.scss";

const MOBILE_BREAKPOINT = 768;

const Layout = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
    const layoutRef = useRef<HTMLDivElement>(null);

    useMetaTitle();
    const { pathname } = useLocation();

    useEffect(() => {
        const handleResize = () => {
            const isNowMobile = window.innerWidth <= MOBILE_BREAKPOINT;
            setIsMobile(isNowMobile);
            if (!isNowMobile) {
                setSidebarCollapsed(false);
            } else {
                setSidebarCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (layoutRef.current) {
            layoutRef.current.scrollTop = 0; 
        }
        
        window.scrollTo(0, 0);
        
        if (isMobile) {
            setSidebarCollapsed(true);
        }
    }, [pathname, isMobile]);

    return (
        <ErrorBoundary>
            <div className='layout-container'>
                <div className='layout-wrapper'>
                    <Navbar onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />
                    
                    <div className='layout'>
                        <Sidebar isCollapsed={sidebarCollapsed} />
                        {isMobile && !sidebarCollapsed && (
                            <div 
                                className="mobile-overlay" 
                                onClick={() => setSidebarCollapsed(true)}
                            />
                        )}
                        <main 
                            ref={layoutRef}
                            className={`layout-content ${sidebarCollapsed ? 'collapsed' : ''}`}
                        >
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Layout;