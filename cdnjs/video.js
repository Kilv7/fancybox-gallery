document.addEventListener("DOMContentLoaded", function () {
  // ===== Модальне вікно =====
  const modal = document.getElementById("modal");
  const btn = document.getElementById("openModal");
  const span = document.getElementsByClassName("close")[0];

  if (btn) {
    btn.onclick = function () {
      modal.style.display = "block";
    };
  }

  if (span) {
    span.onclick = function () {
      modal.style.display = "none";
    };
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ===== Анімація при прокручуванні (Intersection Observer) =====
  const items = document.querySelectorAll(".gallery .item");

  const observerOptions = {
    root: null,
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  items.forEach(item => {
    observer.observe(item);
  });

  // ===== Встановлення розмірів для відео і зображень =====
  document.querySelectorAll('.gallery__item').forEach(function (e) {
    const hrefURL = e.getAttribute('href');
    if (hrefURL.match(/\.(mp4|mov)$/i)) {
      e.dataset.pswpWidth = 1920;
      e.dataset.pswpHeight = 1080;
      e.dataset.type = "video"; // Вказуємо тип контенту як відео
    } else {
      const img = new Image();
      img.onload = function () {
        e.dataset.pswpWidth = this.width;
        e.dataset.pswpHeight = this.height;
      };
      img.src = hrefURL;
    }
  });

  // ===== Запуск відео при кліку на слайд =====
  document.querySelectorAll('.gallery__item').forEach(function (item) {
    item.addEventListener('click', function () {
      const video = this.querySelector('video');
      if (video) {
        video.play();
      }
    });
  });

  // ===== Ініціалізація PhotoSwipe з підтримкою відео =====
  import PhotoSwipeLightbox from './libs/PhotoSwipe/photoswipe-lightbox.esm.min.js';
  import './libs/PhotoSwipe/photoswipe.css';
  import './libs/PhotoSwipe/photoswipe.esm.min.js';

  // Ініціалізація PhotoSwipe Lightbox
  const lightbox = new PhotoSwipeLightbox({
    gallery: '.gallery', // Селектор галереї
    children: 'a',       // Селектор медіа-елементів
    pswpModule: () => import('./libs/PhotoSwipe/photoswipe.esm.min.js'),
  });

  lightbox.on('contentLoad', ({ content }) => {
    const { element, data } = content;

    if (data.type === 'video') {
      // Створення елемента <video>
      const video = document.createElement('video');
      video.src = data.src;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.style.width = '100%';
      video.style.height = '100%';

      // Додавання відео до слайда
      element.innerHTML = '';
      element.appendChild(video);
    }
  });

  lightbox.init();

  // Ініціалізація PhotoSwipe при кліку на елемент галереї
  const gallery = document.querySelectorAll('.gallery');
  gallery.forEach(function (gallery) {
    gallery.addEventListener('click', function (event) {
      event.preventDefault();

      const items = [];
      const links = gallery.querySelectorAll('a');

      links.forEach(function (link, index) {
        const size = link.dataset.pswpWidth && link.dataset.pswpHeight;
        const type = link.dataset.type === "video" ? "video" : "image";
        items.push({
          src: link.getAttribute('href'),
          w: size ? link.dataset.pswpWidth : 0,
          h: size ? link.dataset.pswpHeight : 0,
          type: type,
          video: type === "video" ? { autoplay: true, loop: true, muted: true } : undefined
        });
      });

      const options = {
        index: Array.from(links).indexOf(event.target),
        getThumbBoundsFn: function (index) {
          const thumbnail = links[index].querySelector('img');
          const rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top, w: rect.width };
        },
        getGalleryDOM: function () {
          return document.querySelector('.gallery');
        },
        showAnimationDuration: 0, // Вимкнути анімацію
        hideAnimationDuration: 0, // Вимкнути анімацію
      };

      const pswp = new PhotoSwipe(document.querySelectorAll('.pswp')[0], PhotoSwipeUI_Default, items, options);

      pswp.listen('beforeChange', function () {
        const currentSlide = pswp.currSlide;
        const videoElement = currentSlide.querySelector('video');
        if (videoElement) {
          videoElement.play(); // Запустити відео
        }
      });

      pswp.listen('close', function () {
        const videoElements = pswp.currSlide.querySelectorAll('video');
        videoElements.forEach(function (video) {
          video.pause(); // Зупинити відео після закриття
        });
      });

      pswp.init();
    });
  });
});



