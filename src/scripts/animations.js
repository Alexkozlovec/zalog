// Анимаций нет в тз, но я чуть-чуть добавил)
// Без библиотек и по скроллу. Весит совсем ничего, а пользователю приятно)

// Используется Intersection Observer API https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API
// Сами анимации в отдельном css файле css/animations.css или
// где-то внизу итогового файла)

const elementsToAnimate = document.querySelectorAll("[data-reveal]");
let threshold = 0;

// Процент видимости элемента во вьюпорте, при котором начать анимацию
// Уменьшаю на больших разрешениях
if(window.innerWidth < 992) {
  threshold = 0.7;
} else {
  threshold = 0.4;
}

// css: .hidden {opacity: 0}
const addFullOpacityClass = (elements) => {
  elements.forEach(el => {
    el.classList.add("hidden");
  });
}

// Делаю цепочки анимаций через delay, который можно передать в атрибут
const setAnimationDelay = (el) => {
  el.style.animationDelay = `${el.dataset.reveal}ms`;
}

const addAnimationClass = (el) => {
  el.classList.add("animating");
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      setAnimationDelay(entry.target);
      addAnimationClass(entry.target);
      observer.unobserve(entry.target);
    }
  })
}, {threshold: threshold});

addFullOpacityClass(elementsToAnimate);

elementsToAnimate.forEach(el => {
  observer.observe(el);
});
