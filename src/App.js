import Products from './pages/Products';

import './styles/products.css';
import './styles/fonts.css';

function App() {
  return (
    <div className='App'>
      <header style={{ textAlign: 'center' }}>
          <h1>Products Grid</h1>

          <p>But first, a word from our sponsors:</p>
          <img
            className='ad'
            src={`http://localhost:8000/ads/?r=${Math.floor(Math.random()*1000)}`}
            alt='ad'/>
      </header>
      <Products/>
    </div>
  );
}

export default App;
