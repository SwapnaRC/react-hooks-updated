import React from 'react';

import './IngredientList.css';

const IngredientList = props => {
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map((item, index) => (
          <>
          <li key={index+1} >
            <span>{item.title}</span>
            <span>{item.amount}</span>
            <button type="button" onClick={props.onRemoveItem.bind(this, item.id)}>X</button>
          </li>
          </>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
