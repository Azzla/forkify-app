export default class Likes {
	constructor() {
		this.likes = [];
	}
	
	addLike(id, title, author, img) {
		const like = {
			id,
			title,
			author,
			img
		}
		this.likes.push(like);
		
		//Store data in localStorage
		this.persistData();
		
		return like;
	}
	
	removeLike(id) {
		const i = this.likes.findIndex(el => el.id === id);
		this.likes.splice(i, 1);
		
		//Store data in localStorage
		this.persistData();
	}
	
	isLiked(id) {
		return this.likes.findIndex(el => el.id === id) !== -1;
	}
	
	getNumLikes() {
		return this.likes.length;
	}
	
	persistData() {
		localStorage.setItem('likes', JSON.stringify(this.likes));
	}
	
	retrieveData() {
		const storage = JSON.parse(localStorage.getItem('likes'));
		
		//Restore data from localStorage
		if (storage) this.likes = storage;
	}
}
