import React from 'react';
import './App.css';
import SignUp from './components/signup';
import SignIn from './components/signin';
import { Provider } from 'react-redux'; // or the appropriate library/file
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store  from './redux/store';

function App() {
  return (
    <div className="App">
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" Component= { SignUp } />
          <Route path="/login" Component={SignIn} />
        </Routes>
      </Router>
    </Provider>
    </div>
  );
}

export default App;


