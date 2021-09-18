import { useState, ref, useRef, useCallback, useEffect } from 'react';
import useProductFetch from '../hooks/useProductFetch';
import Product from '../components/Product';

const randomID = () => Math.floor(Math.random()*1000);

function Products() {

  const [productsDisplay, setProductsDisplay] = useState([]);
  const [sortBy, setSortBy] = useState('sort');
  const [pageNumber, setPageNumber] = useState(1);
  const randomAssignments = [];


  const insertAds = (array) => {
    if (array.length === 0) return array; // return empty array
    const arrayWithAds = [...array];
    arrayWithAds.push({ adSpace: true, id: randomID() });

    return arrayWithAds;
  }

  const { products, isLoading, hasMore } = useProductFetch(pageNumber, insertAds);


  const observer = useRef(null);
  const lastProductRef = useCallback(lastElement => {
    // console.log(lastElement)
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log(products.length)
        console.log('visible');
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });
    
    if (lastElement) observer.current.observe(lastElement);
  }, [isLoading, hasMore]);


  const removeAds = (array) => {
    const removed = array.filter(e => e.adSpace === undefined);
    return removed;
  }


  const returnAds = (array, arrayLenWithAds) => {
    const returned = [...array];
    const interval = 20;
    let index = 41;

    returned.splice(20, 0, { adSpace: true, id: randomID() });
    while (index < arrayLenWithAds ) {
      returned.splice(index, 0, { adSpace: true, id: randomID() });
      index += interval + 1;
    }
    return returned;
  };


  const sortProducts = (products, type) => {
    const productsToSort = [...products];
    const removed = removeAds(productsToSort);
    removed.sort((a,b) => (a[type] > b[type]) ? 1 : ((b[type] > a[type]) ? -1 : 0));
    const returned = returnAds(removed, productsToSort.length);
    
    return returned;
  }

  const handleChange = (e) => {
    setSortBy(e.target.value);
    const sorted = sortProducts(products, e.target.value);
    setProductsDisplay([...sorted]);
  }




  useEffect(() => {
    /* perform sorting along with the newly added data */
    if (sortBy !== 'sort') {
      const sorted = sortProducts(products, sortBy);
      setProductsDisplay([...sorted]);

    } else {
      setProductsDisplay([...products]);
    }
    console.log(`product length is: ${products.length}`)
  }, [products]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])


  const assignRandomNumber = () => {
    let random = Math.floor(Math.random()*1000);

    while(randomAssignments.includes(random)) {
      random = Math.floor(Math.random()*1000);
    }

    randomAssignments.push(random);
    return random;
  }

  

  return (
    <div>
      <div className="dropdown-container">
        <select className="dropdown" onChange={handleChange}>
          <option value="sort">Sort by</option>
          <option value="size">Size</option>
          <option value="price">Price</option>
          <option value="id">ID</option>
        </select>
      </div>
      <div className="wrapper-grid">
        {productsDisplay.map((product, i) => {
          if (product.adSpace !== undefined) { 
            return (
              <div className="product" key={i}>
                {product.addSpace}
                <br />
                <img
                  className='ad'
                  src={`http://localhost:8000/ads/?r=${assignRandomNumber()}`}
                  alt='ad'/>
              </div>
            )
          }
          if (i === productsDisplay.length - 2) { // if (i + 1 === productsDisplay.length)
            return (
              <div className="product" key={product.id} ref={lastProductRef}>
                <Product product={product} />
              </div>
            )
          }
          return (
            <div className="product" key={product.id}>
              <Product product={product} />
            </div>
          )
        })}
      </div>
      <div className="loading">{ isLoading && 'Loading...' }</div>
      <div className='end-of-catalogue'>{ hasMore === false && '~ end of catalogue ~' }</div>
    </div>
  );
}

export default Products;