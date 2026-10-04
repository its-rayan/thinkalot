import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
  return (
    <main className="bg-indigo-700 h-screen w-full text-muted antialiased">
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </main>
  );
}
