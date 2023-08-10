import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductItem from "./productItem";
import Card from "../../common/card";
import "./index.css";
import { productCreate, sortType, loadingState } from "../../../actions";
import {
  ADMIN_USER,
  HIGH_TO_LOW,
  LAST_ADDED,
  LOADING_FINISHED,
  LOW_TO_HIGH,
  PENDING,
} from "../../content/form";
import ReactPaginate from "react-paginate";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState();
  const dispatch = useDispatch();
  const user_type = useSelector((state) => state.user_type);
  const sort_type = useSelector((state) => state.sort_type);
  const update_state = useSelector((state) => state.update_state);
  const loading_state = useSelector((state) => state.loading_state);
  const [isLoading, setIsLoading] = useState(true);
  const [isItemLoading, setItemIsLoading] = useState(true);

  // page
  const [itemOffset, setItemOffset] = useState(0);
  // console.log(update_state);
  const fetchProducts = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Get create API error:", errorData);
      } else {
        const data = await response.json();
        const productsArray = data.products || [];
        setProducts(productsArray);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts("/products/last");
  }, []);

  useEffect(() => {
    if (sort === LAST_ADDED) {
      fetchProducts("/products/last");
      console.log("url1");
    } else if (sort === LOW_TO_HIGH) {
      fetchProducts("/products/low");
      console.log("url2");
    } else if (sort === HIGH_TO_LOW) {
      fetchProducts("/products/high");
      console.log("url3");
    }
  }, [sort]);

  const handleSort = (e) => {
    // dispatch(sortType(e.target.value));
    setSort(e.target.value);
  };

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;

    setItemOffset(newOffset);
  };
  const productsList = currentItems.map((product) => (
    <ProductItem
      product={product}
      id={product.id}
      key={product.id}
      name={product.name}
      price={product.price}
      image={product.image}
      description={product.description}
      isItemLoading={isItemLoading}
      setItemIsLoading={setItemIsLoading}
    />
  ));

  return (
    <>
      <div className="all-page">
        <div className="product-option">
          <h1 className="product-title">Products</h1>
          <select
            className="product-select"
            name="sort"
            id="sort"
            onChange={handleSort}
          >
            <option value={LAST_ADDED}>Last added</option>
            <option value={LOW_TO_HIGH}>Price: low to high</option>
            <option value={HIGH_TO_LOW}>Price: high to low</option>
          </select>
          {user_type === ADMIN_USER && !isLoading && (
            <button
              className="add-product-button"
              onClick={() => {
                dispatch(productCreate());
              }}
            >
              Add Product
            </button>
          )}
        </div>

        <section className="products">
          <Card>{isLoading ? <div>is loading</div> : productsList}</Card>
        </section>
        <ReactPaginate
          breakLabel="..."
          nextLabel=">>"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<<"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          nextLinkClassName="page-num"
          previousLinkClassName="page-num"
          activeLinkClassName="active"
        />
      </div>
    </>
  );
};

export default Products;
