import { Switch, Route } from "wouter";
import HomePage from "@/pages/home/HomePage";
import WasteRecognitionPage from "@/pages/waste/WasteRecognitionPage";
import EmissionsPage from "@/pages/emissions/EmissionsPage";
import ForumsPage from "@/pages/forums/ForumsPage";
import MarketplacePage from "@/pages/marketplace/MarketplacePage";
import ProfilePage from "@/pages/profile/ProfilePage";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/not-found";

// No authentication required, all pages are directly accessible
function App() {
  return (
    <Switch>
      {/* All pages are directly accessible without authentication */}
      <Route path="/">
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Route>
      
      <Route path="/waste-recognition">
        <MainLayout>
          <WasteRecognitionPage />
        </MainLayout>
      </Route>
      
      <Route path="/emissions">
        <MainLayout>
          <EmissionsPage />
        </MainLayout>
      </Route>
      
      <Route path="/forums">
        <MainLayout>
          <ForumsPage />
        </MainLayout>
      </Route>
      
      <Route path="/marketplace">
        <MainLayout>
          <MarketplacePage />
        </MainLayout>
      </Route>
      
      <Route path="/profile">
        <MainLayout>
          <ProfilePage />
        </MainLayout>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
