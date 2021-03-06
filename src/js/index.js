import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global App State */
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipes list
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
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
			
		} catch(e) {
			alert('Error processing recipe!');
			console.log(e);
		}
	}
};
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

/**---- LIST CONTROLLER ----**/
const controlList = () => {
	//Init list
	if (!state.list) state.list = new List();
	
	// Add ingredients to the list & UI
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};

/**---- LIKES CONTROLLER ----**/
const controlLikes = () => {
	if (!state.likes) state.likes = new Likes();
	
	const currentID = state.recipe.id;
	
	//User has not liked the current recipe
	if (!state.likes.isLiked(currentID)) {
		// Add like to the state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
		);
		
		// Toggle the like button on UI
		likesView.toggleLikeBtn(true);
		
		// Add like to the UI list
		likesView.renderLike(newLike);
	}
	//User has liked the current recipe
	else {
		// Remove like from the state
		state.likes.removeLike(currentID);
		
		// Toggle like button on UI
		likesView.toggleLikeBtn(false);
		
		// Remove like from the UI list
		likesView.removeLike(currentID);
	}
	likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on load
window.addEventListener('load', () => {
	state.likes = new Likes();
	state.likes.retrieveData();
	
	likesView.toggleLikeMenu(state.likes.getNumLikes());
	
	state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;
	
	//Handle delete button
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		//Delete from state & UI
		state.list.deleteItem(id);
		listView.deleteItem(id);
	}
	else if (e.target.matches('.shopping__count-value')) {
		// Handle the count update
		if (e.target.value > 0) {
			const val = parseFloat(e.target.value, 10);
			state.list.updateCount(id, val);
		}
	}
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// Decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	}
	else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// Increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	}
	else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		// Call list controller
		controlList();
	}
	else if (e.target.matches('.recipe__love, .recipe__love *')) {
		// Call likes controller
		controlLikes();
	}
});
