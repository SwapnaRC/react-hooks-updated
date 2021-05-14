import React, { useReducer, useCallback, useEffect, useMemo } from "react";
import IngredientForm from "./IngredientForm";
import IngredientsList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../hooks/http";

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("should not get there!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: "DELETE", id: reqExtra });
    } else if(!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT'){
      dispatch({
        type: "ADD",
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifier, error, isLoading]);

  const addIngredientsHandler = useCallback((ingredient) => {
    sendRequest(
      "https://react-hooks-updates-a4d66-default-rtdb.firebaseio.com/ingredients.json",
      "POST",
      JSON.stringify(ingredient),
      ingredient,
      "ADD_INGREDIENT"
    );
  }, [sendRequest]);

  const removeHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `https://react-hooks-updates-a4d66-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const filterIngredientsHandler = useCallback((filterIngredients) => {
    dispatch({ type: "SET", ingredients: filterIngredients });
  }, []);


  const ingredientList = useMemo(() => {
    return (
      <IngredientsList
        ingredients={userIngredients}
        onRemoveItem={removeHandler}
      />
    );
  }, [userIngredients, removeHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}> {error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientsHandler}
        loading={isLoading}
      />
      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
