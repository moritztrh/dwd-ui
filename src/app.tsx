import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/landing-page/landing-page';
import DetailsPage from './components/details-page/details-page';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/details" element={<DetailsPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
