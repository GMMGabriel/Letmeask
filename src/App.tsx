import { Routes, Route } from 'react-router-dom';

import Home from "./pages/Home";
import NewRoom from "./pages/NewRoom";
import Room from './pages/Room';

import { AuthContextProvider } from './contexts/AuthContext';

function App() {

  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms/new" element={<NewRoom />} />
        <Route path="/rooms/:id" element={<Room />} />
      </Routes>
    </AuthContextProvider>
  );
}
/*
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/rooms/new" element={<NewRoom />} />
  <Route path="/rooms/:id" element={<Room />} />
</Routes>


<Route path="/rooms/">
  <Route path="new" element={<NewRoom />} />
  <Route path=":id" element={<Room />} />
</Route>
*/

export default App;