import { Suspense } from "react";
import { QueryProvider, RouterProvider } from "./providers";
import { AuthProvider } from "./providers/AuthProvider";
import { Loading } from "@/shared/ui/loading";
import "@/shared/index.css";

function App() {
  return (
    <QueryProvider>
      <AuthProvider> 
        <Suspense fallback={<Loading />}>
          <RouterProvider />
        </Suspense>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
