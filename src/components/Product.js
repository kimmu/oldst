const Product = ({ product }) => {

  const displayDate = (date) => {
    var date = new Date(date);
    var dateNow = new Date(Date.now());

    var differenceInTime =  dateNow.getTime() - date.getTime();
    var differenceInDays = parseInt(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays > 3) {
      return date.toLocaleString();
    } else {
      if ([0, 1].includes(differenceInDays)) return `${differenceInDays} day ago`;
      return `${differenceInDays} days ago`;
    }
  };

  return (
    <>
      <div className="image" style={{ fontSize: `${product.size}px` }}>
        { product.face }
      </div>
      <div className="product-id">
        <span className="product-id-bg">{product.id}</span>
      </div>
      <div className="details">
        <div className="left"><strong>Size:</strong> {product.size} </div>
        <br/>
        <div className="right"><strong>Price:</strong> <sup>$</sup>{product.price}</div>
        <br/>
      </div>
      <div className="date">
        <span className="field">Date Added: </span>
        <span>{displayDate(product.date)}</span><br/>
      </div>
    </>
  );
};

export default Product;