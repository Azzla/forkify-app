import axios from 'axios';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}
	
	async getRecipe() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
		} catch (e) {
			console.log(e);
			alert('Something went wrong. :(')
		}
	}
	
	calcTime() {
		//Assume 15 minutes of time for every 3 ingredients
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}
	
	calcServings() {
		this.servings = 4;
	}
	
	parseIngredients() {
		const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
		const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lb'];
		const units = [...unitsShort, 'kg', 'g'];
		
		const newIng = this.ingredients.map(el => {
			// 1) Uniform and shorten units
			let ingredient = el.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsShort[i]);
			});
			
			// 2) Remove parenthesis
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
			
			// 3) Parse ingredients into count/unit/ingredient
			const arrIng = ingredient.split(' ');
			const unitI = arrIng.findIndex(el2 => unitsShort.includes(el2));
			
			let objIng;
			if (unitI > -1) {
				// There is a unit
				const arrCount = arrIng.slice(0, unitI);
				let count;
				
				if (arrCount.length === 1) {
					count = eval(arrIng[0].replace('-', '+'));
				} else {
					count = eval(arrIng.slice(0, unitI).join('+'));
				}
				
				objIng = {
					count: count,
					unit: arrIng[unitI],
					ingredient: arrIng.slice(unitI + 1).join(' ')
				}
			} else if (parseInt(arrIng[0], 10)) {
				// There is a num but not a unit
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: '',
					ingredient: arrIng.slice(1).join(' ')
				}
			} else if (unitI === -1) {
				// There is not a unit and not a num
				objIng = {
					count: 1,
					unit: '',
					ingredient
				}
			}
			
			
			return objIng;
		});
		
		this.ingredients = newIng;
	}
	
	updateServings(type) {
		// Servings
		const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
		
		//Ingredients
		this.ingredients.forEach(ing => {
			ing.count *= (newServings / this.servings);
		});
		
		this.servings = newServings;
	}
}


















//
