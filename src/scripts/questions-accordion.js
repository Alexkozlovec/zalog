const questionsAccordion = document.querySelector(".questions-accordion");
const questionsAccordionItems = questionsAccordion.querySelectorAll(
  ".questions-accordion__item"
);

const CLASSES = {
  question: "questions-accordion__question",
  toggleBtn: "questions-accordion__btn",
  activity: "active",
  answer: "questions-accordion__answer",
};

const setZeroHeight = (item) => {
  item.style.maxHeight = "0px";
};

const setNormalHeight = (item) => {
  item.style.maxHeight = `${item.scrollHeight}px`;
};

const changeAnswerHeight = (parent, answer) => {
  if (parent.classList.contains(CLASSES.activity)) {
    setNormalHeight(answer);
  } else {
    setZeroHeight(answer);
  }
};

const toggleQuestion = (idx) => {

  const currentItem = questionsAccordionItems[idx];

  currentItem.classList.toggle(CLASSES.activity);

  const currentItemAnswer = currentItem.querySelector(`.${CLASSES.answer}`);

  changeAnswerHeight(currentItem, currentItemAnswer);
};

questionsAccordionItems.forEach((question, i) => {
  const currentQuestionAnswer = question.querySelector(`.${CLASSES.answer}`);

  changeAnswerHeight(question, currentQuestionAnswer);

  question.addEventListener("click", (evt) => {
    const cl = evt.target.classList;

    if (cl.contains(CLASSES.toggleBtn) || cl.contains(CLASSES.question)) {
      toggleQuestion(i);
    }
  });
});
