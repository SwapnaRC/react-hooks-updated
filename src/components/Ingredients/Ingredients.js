import React, { useReducer, useState, useCallback, useEffect } from "react";
import IngredientForm from "./IngredientForm";
import IngredientsList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return currentIngredients, action.ingredient;
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new error("should not get there!");
  }
};
const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  // const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessgae, setErrorMessgae] = useState();

  useEffect(() => {
    console.log("Rendering ingredients", userIngredients);
  }, [userIngredients]);

  const addIngredientsHandler = (ingredient) => {
    console.log(isLoading, " before isLoading");
    setIsLoading(true);
    console.log(isLoading, "isLoading");
    fetch(
      "https://react-hooks-updates-a4d66-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        setIsLoading(false);
        response.json();
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData, ...ingredient },
        ]);
      })
      .catch((err) => {
        setErrorMessgae("something went to wrong");
      });
  };

  const removeHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-updates-a4d66-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        setIsLoading(false);
        setUserIngredients((prevIngredients) =>
          prevIngredients.filter((item) => item.id !== ingredientId)
        );
      })
      .catch((err) => {
        setErrorMessgae("something went to wrong");
      });
  };

  const filterIngredientsHandler = useCallback((filterIngredients) => {
    setUserIngredients(filterIngredients);
  }, []);

  const onCloseError = () => {
    setErrorMessgae(null);
    setIsLoading(false);
  };
  return (
    <div className="App">
      {errorMessgae && (
        <ErrorModal onClose={onCloseError}> {errorMessgae}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientsHandler}
        loading={isLoading}
      />
      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientsList
          ingredients={userIngredients}
          onRemoveItem={removeHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
