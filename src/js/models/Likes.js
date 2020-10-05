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
		return like;
	}
	
	removeLike(id) {
		const i = this.likes.findIndex(el => el.id === id);
		this.likes.splice(i, 1);
	}
	
	isLiked(id) {
		return this.likes.findIndex(el => el.id === id) !== -1;
	}
	
	getNumLikes() {
		return this.likes.length;
	}
}
