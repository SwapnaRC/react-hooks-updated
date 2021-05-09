import React, { useReducer, useCallback, useEffect } from "react";
import IngredientForm from "./IngredientForm";
import IngredientsList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

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

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
      case "CLEAR":
        return {...curHttpState, error: null};
    default:
      throw new Error("Should not  be reached");
  }
};
const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMessgae, setErrorMessgae] = useState();

  useEffect(() => {
    console.log("Rendering ingredients", userIngredients);
  }, [userIngredients]);

  const addIngredientsHandler = (ingredient) => {
    dispatchHttp({ type: "SEND" });
    // setIsLoading(true);
    fetch(
      "https://react-hooks-updates-a4d66-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        // setIsLoading(false);
        dispatchHttp({ type: "RESPONSE" });
        response.json();
      })
      .then((responseData) => {
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: responseData, ...ingredient },
        // ]);
        dispatch({
          type: "ADD",
          ingredient: { id: responseData, ...ingredient },
        });
      })
      .catch((err) => {
        // setErrorMessgae("something went to wrong");
        dispatchHttp({ type: "ERROR", errorMessage: 'Something went wrong in add ingrendits' });
      });
  };

  const removeHandler = (ingredientId) => {
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://react-hooks-updates-a4d66-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        // setIsLoading(false);
        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter((item) => item.id !== ingredientId)
        // );
        dispatchHttp({ type: "RESPONSE" });
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((err) => {
        dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrog in remove handler'})
      //   setErrorMessgae("something went to wrong");
      });
  };

  const filterIngredientsHandler = useCallback((filterIngredients) => {
    // setUserIngredients(filterIngredients);
    dispatch({ type: "SET", ingredients: filterIngredients });
  }, []);

  const onCloseError = () => {
    dispatchHttp({ type: "CLEAR" });
  };
  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={onCloseError}> {httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientsHandler}
        loading={httpState.loading}
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
