import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

/* Global App State */
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipes
const state = {};

const controlSearch = async () => {
	// Get query from searchView.
	const query = searchView.getInput();
	
	if (query) {
		// Create new Search obj / add data to global state
		state.search = new Search(query);
		
		// Clear UI for results
		searchView.clearInput();
		searchView.clearResults();
		
		// Search for recipes
		await state.search.getResults();
		
		// Display recipe results
		searchView.renderResults(state.search.result);
	}
}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

//const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
