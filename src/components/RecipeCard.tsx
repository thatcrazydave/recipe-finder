import React from "react";
import { Link } from "react-router-dom";
import { Recipe } from "../api";
import "../pages/Home.css";

interface Props {
  recipe: Recipe;
}

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe.idMeal}`} className="recipe-card">
      <img 
        src={recipe.strMealThumb} 
        alt={recipe.strMeal}
        loading="lazy"
      />
      <h3>{recipe.strMeal}</h3>
    </Link>
  );
};

export default RecipeCard;
