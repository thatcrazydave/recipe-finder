import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { getFilteredRecipes, searchRecipes, Recipe } from "../api";
import './Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const savedRecipes = localStorage.getItem('lastSearchRecipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('lastSearchRecipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleSearch = async (query: string, region?: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = region 
        ? await getFilteredRecipes(region, query)
        : await searchRecipes(query);
      setRecipes(results);
    } catch (error) {
      setError('Failed to fetch recipes. Please try again.');
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title" onClick={() => setRecipes([])}>
        Recipe Finder 🍽️
      </h1>
      <SearchBar onSearch={handleSearch} />
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="loading-container">
          <p>Searching for recipes...</p>
        </div>
      ) : (
        <div className="recipeGrid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
          {recipes.length === 0 && !loading && !error && (
            <p className="no-results">No recipes found. Try another search!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
