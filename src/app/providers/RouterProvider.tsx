import { RouterProvider as ReactRouterProvider } from "react-router-dom";
import { routes } from "../routes";

export function RouterProvider() {
  return <ReactRouterProvider router={routes} />;
}

