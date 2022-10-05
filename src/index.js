import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Gallery } from './js/image-resource';

const images = new Gallery();
const lightbox = new SimpleLightbox('.gallery a', {});

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

searchForm.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onloadMoreBtnClick);

function onFormSubmit(e) {
  e.preventDefault();

  images.searchQueryInput = e.target.elements.searchQuery.value;

  images.currentPage = 1;
  loadMoreBtn.setAttribute('hidden', true);
  gallery.innerHTML = '';

  images
    .getImages(images.searchQueryInput)
    .then(response => {
      console.log(response);

      if (response.data.hits.length === 0) {
        gallery.innerHTML = '';
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
      getRender(response.data.hits);
      lightbox.refresh();
      loadMoreBtn.removeAttribute('hidden', false);
    })
    .catch(err => Notiflix.Notify.failure(err.message));
  searchForm.reset();
}

function onloadMoreBtnClick() {
  images.pageIncrement();
  images.getImages().then(response => {
    getRender(response.data.hits);
    if (images.currentPage * images.perPage > response.data.totalHits) {
      loadMoreBtn.setAttribute('hidden', true);
      loadMoreBtn.disabled = true;
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function getRender(array) {
  const markup = array
    .map(arr => {
      return `<div class="photo-card">
		<a href="${arr.largeImageURL}">
<img src="${arr.webformatURL}" alt="${arr.tags}" loading="lazy" width="300" height="150"/></a>
<div class="info">
  <p class="info-item">
  <b>👍</b>
	${arr.likes}
  </p>
  <p class="info-item">
  <b>👁</b>
	 ${arr.views}
  </p>
  <p class="info-item">
  <b>💭</b>
	 ${arr.comments}
  </p>
  <p class="info-item">
  <b>⬇</b>
	 ${arr.downloads}
  </p>
</div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
