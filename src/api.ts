import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  [key: string]: string | undefined; // For dynamic ingredient properties
}

export interface Region {
  strArea: string;
}

/**
 * Search recipes by name (e.g., "Arrabiata", "Jollof", "Rice")
 */
export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/search.php?s=${query}`);
    return res.data.meals || [];
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
  }
};

/**
 * Get full recipe details by ID
 */
export const getRecipeDetails = async (id: string): Promise<Recipe | null> => {
  try {
    const res = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
    return res.data.meals ? res.data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return null;
  }
};

/**
 * Get all available meal regions
 */
export const getMealRegions = async (): Promise<Region[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/list.php?a=list`);
    return res.data.meals || [];
  } catch (error) {
    console.error("Error fetching meal regions:", error);
    return [];
  }
};

/**
 * Get recipes by region and filter by search query
 */
export const getFilteredRecipes = async (region: string, query: string): Promise<Recipe[]> => {
  try {
    // First get all recipes from the selected region
    const regionRes = await axios.get(`${BASE_URL}/filter.php?a=${region}`);
    let recipes = regionRes.data.meals || [];

    // If there's a search query, filter the recipes
    if (query.trim()) {
      recipes = recipes.filter((recipe: Recipe) => 
        recipe.strMeal.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Get full details for each recipe to include category and area
    const detailedRecipes = await Promise.all(
      recipes.map(async (recipe: Recipe) => {
        const details = await getRecipeDetails(recipe.idMeal);
        return details || recipe;
      })
    );

    return detailedRecipes.filter(Boolean);
  } catch (error) {
    console.error("Error fetching filtered recipes:", error);
    return [];
  }
};
