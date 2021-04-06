// Добавил немного анимаций по скроллу)
// Без библиотек. Весит совсем ничего, а скроллить интереснее.

// Использую Intersection Observer API https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API
// Сами анимации в отдельном css файле css/animations.css или
// где-то внизу итогового файла)

const elementsToAnimate = document.querySelectorAll("[data-reveal]");

const animationClass = "animated";
const hidingElementClass = "hidden";

// Процент видимости элемента во вьюпорте, при котором начать анимацию
// Уменьшаю на больших разрешениях
let threshold = 0;
if(window.innerWidth < 992) {
  threshold = 0.7;
} else {
  threshold = 0.4;
}

// CSS: .hidden {opacity: 0}
const addFullOpacityClass = (elements) => {
  elements.forEach(el => {
    el.classList.add(hidingElementClass);
  });
}

// Делаю цепочки анимаций через delay, который можно передать в атрибут
const setAnimationDelay = (el) => {
  el.style.animationDelay = `${el.dataset.reveal}ms`;
}

const addAnimationClass = (el) => {
  el.classList.add(animationClass);
}

// Убирает анимационные классы
const removeAnimationClasses = (el) => {
  el.classList.remove(hidingElementClass, animationClass);
}

const animateElement = (el) => {
  setAnimationDelay(el);
  addAnimationClass(el);

  el.addEventListener("animationend", () => {
    removeAnimationClasses(el);
  });
}

// Отслеживает позицию полученных элементов и анимирует в нужный момент
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      animateElement(entry.target);
      observer.unobserve(entry.target);
    }
  })
}, {threshold: threshold});

// Прячет элементы перед анимацией
addFullOpacityClass(elementsToAnimate);

// Запускает наблюдатель
elementsToAnimate.forEach(el => {
  observer.observe(el);
});
