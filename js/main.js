Fancybox.bind("[data-fancybox='gallery']", {
  Thumbs: {
    autoStart: true, // Відкрити мініатюри автоматично
  },
  Toolbar: {
    display: ["close"], // Показати лише кнопку "Закрити"
  },
  Video: {
    autoStart: true, // Автоматичний старт відео
    ratio: 16 / 9, // Пропорція для відео (налаштуйте, якщо потрібно)
  },
  Image: {
    zoom: true, // Дозволяє масштабувати зображення
  },
  on: {
    initSlide: (fancybox, slide) => {
      // Налаштування стилів для відео
      const video = slide.$el.querySelector("video");
      if (video) {
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover"; // Прибирає чорні краї
      }
    },
  },
});
// Робота з модальним вікном
const modal = document.getElementById('modal');
const openModal = document.getElementById('openModal');
const closeModal = document.querySelector('.close');

const toggleModal = (action) => {
  modal.classList[action]('show');
};

openModal.addEventListener('click', () => toggleModal('add'));
closeModal.addEventListener('click', () => toggleModal('remove'));
window.addEventListener('click', (event) => {
  if (event.target === modal) toggleModal('remove');
});

// Отримуємо посилання на кнопку
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Функція для показу/приховування кнопки
window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    scrollToTopBtn.style.display = 'flex';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
});

// Функція для прокручування вгору
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});









