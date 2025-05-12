import logo from './logo.svg';
import './App.css';
import Record from './components/Record';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Details from './components/Details';
import Update from './components/Update';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Record />} />
        <Route path='/findbyid/:id' element={<Details />} />
        <Route path='/update/:id' element={<Update/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
