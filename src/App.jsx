import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Stage from './pages/Stage';
import CharacterStatus from './components/CharacterStatus';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <CharacterStatus />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stage/:stageId" element={<Stage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
