import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginUser from './pages/LoginUser';
import RegisterUser from './pages/RegisterUser';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginUser />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
