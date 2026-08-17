"use strict";

/* =========================================
   WEBBUILD INTAKE
   Premium Project Brief Experience
========================================= */

const TOTAL_PROJECT_QUESTIONS = 5;

const introScreen =
  document.getElementById("introScreen");

const intakeForm =
  document.getElementById("intakeForm");

const successScreen =
  document.getElementById("successScreen");

const startButton =
  document.getElementById("startButton");

const newRequestButton =
  document.getElementById("newRequestButton");

const reviewButton =
  document.getElementById("reviewButton");

const editButton =
  document.getElementById("editButton");

const reviewContent =
  document.getElementById("reviewContent");

const progressBar =
  document.getElementById("progressBar");

const stepNumber =
  document.getElementById("stepNumber");

const totalSteps =
  document.getElementById("totalSteps");

const questions =
  Array.from(
    document.querySelectorAll(".question")
  );


let currentStep = 1;


/* =========================================
   INITIALIZATION
========================================= */

totalSteps.textContent =
  TOTAL_PROJECT_QUESTIONS;

hideAllQuestions();

progressBar.style.width = "20%";

stepNumber.textContent = "1";


/* =========================================
   START
========================================= */

startButton.addEventListener(
  "click",
  () => {

    introScreen.classList.remove(
      "active"
    );

    intakeForm.classList.add(
      "active"
    );

    currentStep = 1;

    showQuestion(
      currentStep
    );

  }
);


/* =========================================
   HIDE ALL QUESTIONS
========================================= */

function hideAllQuestions() {

  questions.forEach(
    question => {

      question.style.display =
        "none";

    }
  );

}


/* =========================================
   SHOW QUESTION
========================================= */

function showQuestion(step) {

  hideAllQuestions();


  const question =
    questions.find(
      item =>
        Number(
          item.dataset.question
        ) === step
    );


  if (!question) {
    return;
  }


  question.style.display =
    "block";


  updateProgress(step);


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================
   PROGRESS
========================================= */

function updateProgress(step) {

  const visibleStep =
    Math.min(
      step,
      TOTAL_PROJECT_QUESTIONS
    );


  const percentage =
    (
      visibleStep /
      TOTAL_PROJECT_QUESTIONS
    ) * 100;


  progressBar.style.width =
    `${percentage}%`;


  stepNumber.textContent =
    visibleStep;

}


/* =========================================
   NEXT BUTTONS
========================================= */

document
  .querySelectorAll(".next-button")
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const activeQuestion =
            getActiveQuestion();


          if (!activeQuestion) {
            return;
          }


          if (
            !validateQuestion(
              activeQuestion
            )
          ) {
            return;
          }


          const current =
            Number(
              activeQuestion.dataset.question
            );


          currentStep =
            current + 1;


          showQuestion(
            currentStep
          );

        }
      );

    }
  );


/* =========================================
   BACK BUTTONS
========================================= */

document
  .querySelectorAll(".back-button")
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const activeQuestion =
            getActiveQuestion();


          if (!activeQuestion) {
            return;
          }


          const current =
            Number(
              activeQuestion.dataset.question
            );


          currentStep =
            Math.max(
              1,
              current - 1
            );


          showQuestion(
            currentStep
          );

        }
      );

    }
  );


/* =========================================
   ACTIVE QUESTION
========================================= */

function getActiveQuestion() {

  return questions.find(
    question =>
      question.style.display !== "none"
  );

}


/* =========================================
   VALIDATION
========================================= */

function validateQuestion(
  question
) {

  const fields =
    question.querySelectorAll(
      "input[required], textarea[required]"
    );


  for (const field of fields) {

    if (
      field.type === "radio"
    ) {

      const radios =
        question.querySelectorAll(
          `input[name="${CSS.escape(field.name)}"]`
        );


      const selected =
        Array.from(radios)
          .some(
            radio =>
              radio.checked
          );


      if (!selected) {

        alert(
          "Choose an option to continue."
        );

        return false;

      }


      continue;

    }


    if (
      !field.value.trim()
    ) {

      field.focus();

      alert(
        "Please complete this section before continuing."
      );

      return false;

    }


    if (
      field.type === "email" &&
      !field.checkValidity()
    ) {

      field.focus();

      alert(
        "Please enter a valid email address."
      );

      return false;

    }

  }


  return true;

}


/* =========================================
   REVIEW
========================================= */

reviewButton.addEventListener(
  "click",
  () => {

    const contact =
      document.querySelector(
        '[data-question="6"]'
      );


    if (
      !validateQuestion(
        contact
      )
    ) {
      return;
    }


    buildProjectBrief();


    hideAllQuestions();


    const reviewScreen =
      document.getElementById(
        "reviewScreen"
      );


    reviewScreen.style.display =
      "block";


    progressBar.style.width =
      "100%";


    stepNumber.textContent =
      TOTAL_PROJECT_QUESTIONS;


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/* =========================================
   PROJECT BRIEF
========================================= */

function buildProjectBrief() {

  reviewContent.innerHTML = "";


  const fields = [

    {
      label: "Project Type",
      name: "Page Type"
    },

    {
      label: "Primary Objective",
      name: "Main Goal"
    },

    {
      label: "Business / Offer",
      name: "What They Offer"
    },

    {
      label: "Target Audience",
      name: "Target Audience"
    },

    {
      label: "Benefits & Solutions",
      name: "Benefits and Solutions"
    },

    {
      label: "Contact Name",
      name: "Name"
    },

    {
      label: "Contact Email",
      name: "Email"
    }

  ];


  fields.forEach(
    field => {

      const value =
        getFieldValue(
          field.name
        );


      createReviewItem(
        field.label,
        value
      );

    }
  );

}


/* =========================================
   GET FIELD VALUE
========================================= */

function getFieldValue(
  name
) {

  const field =
    intakeForm.elements[name];


  if (
    field instanceof RadioNodeList
  ) {

    const selected =
      Array.from(field)
        .find(
          radio =>
            radio.checked
        );


    return selected
      ? selected.value
      : "";

  }


  return field
    ? field.value.trim()
    : "";

}


/* =========================================
   REVIEW ITEM
========================================= */

function createReviewItem(
  label,
  value
) {

  const item =
    document.createElement(
      "div"
    );

  item.className =
    "review-item";


  const title =
    document.createElement(
      "div"
    );

  title.className =
    "review-label";

  title.textContent =
    label;


  const content =
    document.createElement(
      "div"
    );

  content.className =
    "review-value";

  content.textContent =
    value || "Not provided";


  item.appendChild(title);

  item.appendChild(content);


  reviewContent.appendChild(
    item
  );

}


/* =========================================
   EDIT REQUEST
========================================= */

editButton.addEventListener(
  "click",
  () => {

    currentStep = 6;

    showQuestion(
      currentStep
    );

  }
);


/* =========================================
   FORM SUBMISSION
========================================= */

intakeForm.addEventListener(
  "submit",
  event => {

    /*
      FormSubmit receives the form.

      We intentionally allow the browser
      to perform the normal POST request.

      This means the submission isn't
      falsely marked as successful
      before the external service receives it.
    */

    const name =
      getFieldValue("Name");

    const email =
      getFieldValue("Email");


    if (!name || !email) {

      event.preventDefault();

      alert(
        "Please provide your name and email."
      );

      return;

    }

  }
);


/* =========================================
   NEW REQUEST
========================================= */

newRequestButton.addEventListener(
  "click",
  () => {

    intakeForm.reset();

    reviewContent.innerHTML = "";


    successScreen.classList.remove(
      "active"
    );

    introScreen.classList.add(
      "active"
    );


    currentStep = 1;


    progressBar.style.width =
      "20%";

    stepNumber.textContent =
      "1";


    hideAllQuestions();


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/* =========================================
   PWA INSTALL PROMPT
========================================= */

let deferredInstallPrompt = null;


window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    deferredInstallPrompt =
      event;

  }
);


/* =========================================
   SERVICE WORKER
========================================= */

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("./sw.js")
        .then(
          () => {

            console.log(
              "WebBuild is ready for offline use."
            );

          }
        )
        .catch(
          error => {

            console.error(
              "Service worker error:",
              error
            );

          }
        );

    }
  );

}


/* =========================================
   KEYBOARD ACCESSIBILITY
========================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      const active =
        getActiveQuestion();


      if (!active) {
        return;
      }


      const step =
        Number(
          active.dataset.question
        );


      if (step > 1) {

        currentStep =
          step - 1;

        showQuestion(
          currentStep
        );

      }

    }

  }
);
