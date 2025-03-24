import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Features from "@/pages/Features";
import Calculators from "@/pages/Calculators";
import Demo from "@/pages/Demo";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Auth from "@/pages/Auth"; // Added Auth component import

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/features" component={Features} />
          <Route path="/calculators" component={Calculators} />
          <Route path="/demo" component={Demo} />
          <Route path="/auth" component={Auth} /> {/* Added Auth route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;