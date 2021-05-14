import React, { useState, useEffect, useRef } from "react";
import Card from "../UI/Card";
import useHttp from '../hooks/http'
import "./Search.css";
import ErrorModal from '../UI/ErrorModal'

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  const {isLoading, data, error, sendRequest, clear} = useHttp();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
       sendRequest("https://react-hooks-updates-a4d66-default-rtdb.firebaseio.com/ingredients.json" +
       query, 
       'GET')
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
if(!isLoading && !error && data) {
  const loadingIngredients = [];
  for (const key in data) {
    loadingIngredients.push({
      id: key,
      title: data[key].title,
      amount: data[key].amount,
    });
  }
  onLoadIngredients(loadingIngredients);
}
  }, [data, isLoading, error, onLoadIngredients])
  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>loading...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(e) => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
