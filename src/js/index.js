import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global App State */
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipes
const state = {};


/**---- SEARCH CONTROLLER ----**/
const controlSearch = async () => {
	// Get query from searchView.
	const query = searchView.getInput();
	
	if (query) {
		// Create new Search obj / add data to global state
		state.search = new Search(query);
		
		// Clear UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);
		
		try {
			// Search for recipes
			await state.search.getResults();
			
			// Display recipe results
			clearLoader();
			searchView.renderResults(state.search.result);
			
		} catch(e) {
			alert('Something went wrong during the search!');
			clearLoader();
		}
	}
}

//Form submission listener
elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

//Page button listener
elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});

/**---- RECIPE CONTROLLER ----**/
const controlRecipe = async () => {
	// Get ID from url
	const id = window.location.hash.replace('#','');
	
	if (id) {
		// Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);
		
		//Highlight selected search item
		if (state.search) searchView.highlightSelected(id);
		
		// Create new recipe object
		state.recipe = new Recipe(id);
		try {
			// Get recipe data & parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();
			
			// Calc servings and cooking time
			state.recipe.calcServings(); state.recipe.calcTime();
			
			// Render recipe to UI
			clearLoader();
			recipeView.renderRecipe(state.recipe);
			
		} catch(e) {
			alert('Error processing recipe!');
			console.log(e);
		}
	}
};





















['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));
//
