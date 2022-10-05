import axios from 'axios';

export class Gallery {
  currentPage = 1;
  searchQueryInput = '';
  perPage = 40;

  async getImages(q) {
    if (this.searchQueryInput === '') {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (q) {
      this.searchQueryInput = q;
    }
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
    });

    const gallery = await axios.get(
      `https://pixabay.com/api/?key=30382978-0d394059223eee2c0244a0335&q=${this.searchQueryInput}&page=${this.currentPage}&${searchParams}`
    );
    return gallery;
  }

  pageIncrement() {
    this.currentPage += 1;
  }
}
