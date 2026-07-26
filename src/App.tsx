import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';
import { EnrollStatusProvider } from '@/lib/enroll-status-context';
import Home from '@/pages/home';
import Admin from '@/pages/admin';
import MyCourses from '@/pages/my-courses';
import Learn from '@/pages/learn';
import NotFound from '@/pages/not-found';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/my-courses" component={MyCourses} />
      <Route path="/learn/:courseId" component={Learn} />
      <Route component={NotFound} />
    </Switch>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <EnrollStatusProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
          </EnrollStatusProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
