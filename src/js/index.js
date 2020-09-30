import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

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
		renderLoader(elements.searchRes);
		await state.search.getResults();
		
		// Display recipe results
		clearLoader();
		searchView.renderResults(state.search.result);
	}
}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});

//const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
