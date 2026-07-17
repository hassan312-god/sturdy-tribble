import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Toaster } from 'sonner';
import Home from '@/pages/home';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
        <Switch>
          <Route path="/" component={Home} />
          <Route>
            <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground font-mono">
              404 | NOT FOUND
            </div>
          </Route>
        </Switch>
      </WouterRouter>
      <Toaster theme="dark" position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;