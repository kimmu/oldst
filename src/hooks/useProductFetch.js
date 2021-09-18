import { useEffect, useState } from 'react';
import axios from 'axios';

const apiEndpoint = (page) => `http://localhost:8000/products?_page=${page}&_limit=20`;

function useProductSearch(pageNumber, insertAds) {

  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [batch, setBatch] = useState({ nextBatch: [], pageNumber: 2 });

  const fetchProducts = async (page) => {
    const url = apiEndpoint(page);
    try {
      const { data } = await axios.get(url);
      console.log(data)
      return data;
    } catch(error) {
      alert(`Something went wrong: ${error}`);
    }   
  }

  const fetchNextBatch = (page) => {
    console.log("I go here yow")
    const url = apiEndpoint(page);
    axios.get(url)
      .then(({ data }) => {
        setBatch({ nextBatch: data, pageNumber: page });
      })
      .catch((error) => {
        alert(`Something went wrong: ${error}`);
      });
  }

  const fetchNow = async () => {
    setIsLoading(true);
    const data = await fetchProducts(pageNumber);
    setProducts(prevProducts => {
      return [...prevProducts, ...insertAds(data)]
    });

    setHasMore(data.length > 0);
    setIsLoading(false);
  }



  useEffect(async () => {

    /* pre-emptively fetch next batch,
       runs synchronously
    */
    fetchNextBatch(pageNumber + 1);

    /* if no pre-emptive fetch exists, do immediate fetch */
    if (batch.nextBatch.length === 0) {
      await fetchNow();
    } else {
      /* else if there exist a pre-emptive fetch */

      /*
        make sure to only use the next batch if the next batch's page number is equal to the current page which needs fetching
        this is because you might use a batch for a previous page number which has just recently finished fetching (due to its asynchronous nature)
      */
      if (batch.pageNumber === pageNumber) {
        setProducts(prevProducts => {
          const nextBatch = insertAds(batch.nextBatch);
          return [...prevProducts, ...nextBatch];
        });
        setBatch({ ...batch, nextBatch: [] })
      } else {
        await fetchNow();
      }
    }

  }, [pageNumber]);

  return {
    products,
    isLoading,
    hasMore
  };
}

export default useProductSearch;