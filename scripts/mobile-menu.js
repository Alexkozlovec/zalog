const burgerBtn = document.querySelector(".burger");
const navList = document.querySelector(".nav__list");

const closeMenuOnLinkClick = (evt) => {
  if(evt.target.classList.contains("nav__link")) {
    toggleMenu();
  }
}

const setMaxHeight = (el, height) => {
  el.style.maxHeight = `${height}px`;
}

const toggleMenu = () => {
  navList.classList.toggle("active");
  burgerBtn.classList.toggle("active");

  if (navList.classList.contains("active")) {
    setMaxHeight(navList, navList.scrollHeight);
    navList.addEventListener("click", closeMenuOnLinkClick);
  } else {
    setMaxHeight(navList, 0);
    navList.removeEventListener("click", closeMenuOnLinkClick);
  }
}

burgerBtn.addEventListener("click", toggleMenu);
