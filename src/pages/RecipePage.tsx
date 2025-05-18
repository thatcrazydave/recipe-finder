import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeDetails, Recipe } from "../api";
import "./Home.css";

const RecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (id) {
          setLoading(true);
          const data = await getRecipeDetails(id);
          setRecipe(data);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const getIngredients = () => {
    if (!recipe) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && typeof ingredient === 'string' && ingredient.trim()) {
        ingredients.push(`${measure || ''} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading recipe details...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="error-container">
        <p>Recipe not found</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="food-details">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Recipes
        </button>
        
        <div className="recipe-header">
          <h1>{recipe.strMeal}</h1>
          <div className="recipe-meta">
            {recipe.strCategory && (
              <span className="recipe-category">{recipe.strCategory}</span>
            )}
            {recipe.strArea && (
              <span className="recipe-area">{recipe.strArea}</span>
            )}
          </div>
        </div>

        <img 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal} 
          className="food-img"
        />

        <div className="recipe-details">
          <section className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {getIngredients().map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </section>

          <section className="instructions-section">
            <h2>Instructions</h2>
            <div className="instructions-text">
              {recipe.strInstructions?.split('\n').map((instruction, index) => (
                instruction.trim() && (
                  <p key={index}>{instruction}</p>
                )
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
