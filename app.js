"use strict";

/* =========================================
   WEBBUILD INTAKE — APP LOGIC
========================================= */

const TOTAL_QUESTIONS = 5;


/* =========================================
   ELEMENTS
========================================= */

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


const questions = Array.from(
  document.querySelectorAll(".question")
);


/* =========================================
   STATE
========================================= */

let currentStep = 1;


/*
  The contact section is technically
  question 6 in the HTML, but it isn't
  counted as one of the five project
  questions.
*/

const contactStep = 6;

totalSteps.textContent = TOTAL_QUESTIONS;


/* =========================================
   START APPLICATION
========================================= */

startButton.addEventListener(
  "click",
  () => {

    introScreen.classList.remove("active");

    intakeForm.classList.add("active");

    currentStep = 1;

    showStep(currentStep);

  }
);


/* =========================================
   SHOW STEP
========================================= */

function showStep(step) {

  questions.forEach(
    question => {

      question.style.display = "none";

    }
  );


  const target =
    questions.find(
      question =>
        Number(
          question.dataset.question
        ) === step
    );


  if (!target) {
    return;
  }


  target.style.display = "block";


  /*
    Project questions are 1–5.
    Contact information is step 6.
    Review has no data-question.
  */

  if (step <= TOTAL_QUESTIONS) {

    stepNumber.textContent = step;

    const progress =
      (step / TOTAL_QUESTIONS) * 100;

    progressBar.style.width =
      `${progress}%`;

  } else {

    stepNumber.textContent =
      TOTAL_QUESTIONS;

    progressBar.style.width =
      "100%";

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================
   NEXT BUTTONS
========================================= */

document
  .querySelectorAll(".next-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        /*
          Find the currently visible question.
        */

        const activeQuestion =
          questions.find(
            question =>
              question.style.display !== "none"
          );


        if (!activeQuestion) {
          return;
        }


        /*
          Check that the current question
          has been answered.
        */

        if (
          !validateQuestion(
            activeQuestion
          )
        ) {
          return;
        }


        const activeStep =
          Number(
            activeQuestion.dataset.question
          );


        /*
          Move to the next section.
        */

        currentStep =
          activeStep + 1;


        showStep(currentStep);

      }
    );

  });


/* =========================================
   BACK BUTTONS
========================================= */

document
  .querySelectorAll(".back-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const activeQuestion =
          questions.find(
            question =>
              question.style.display !== "none"
          );


        if (!activeQuestion) {
          return;
        }


        const activeStep =
          Number(
            activeQuestion.dataset.question
          );


        currentStep =
          activeStep - 1;


        if (currentStep < 1) {

          currentStep = 1;

        }


        showStep(currentStep);

      }
    );

  });


/* =========================================
   VALIDATE QUESTION
========================================= */

function validateQuestion(question) {

  const requiredFields =
    question.querySelectorAll(
      "input[required], textarea[required]"
    );


  for (const field of requiredFields) {

    /*
      Radio buttons need special handling.
    */

    if (
      field.type === "radio"
    ) {

      const group =
        question.querySelectorAll(
          `input[name="${CSS.escape(field.name)}"]`
        );


      const selected =
        Array.from(group).some(
          radio => radio.checked
        );


      if (!selected) {

        showValidationMessage(
          "Please choose an option before continuing."
        );

        return false;
      }

      continue;
    }


    if (!field.value.trim()) {

      field.focus();

      showValidationMessage(
        "Please complete this question before continuing."
      );

      return false;
    }


    /*
      Browser email validation.
    */

    if (
      field.type === "email" &&
      !field.checkValidity()
    ) {

      field.focus();

      showValidationMessage(
        "Please enter a valid email address."
      );

      return false;
    }

  }


  return true;
}


/* =========================================
   VALIDATION MESSAGE
========================================= */

function showValidationMessage(message) {

  /*
    Use the browser's built-in alert for now.
    We'll keep the project simple and reliable.
  */

  window.alert(message);
}


/* =========================================
   REVIEW BUTTON
========================================= */

reviewButton.addEventListener(
  "click",
  () => {

    const contactQuestion =
      document.querySelector(
        '[data-question="6"]'
      );


    if (
      !validateQuestion(
        contactQuestion
      )
    ) {
      return;
    }


    buildReview();


    questions.forEach(
      question => {

        question.style.display =
          "none";

      }
    );


    reviewContent
      .closest(".question")
      .style.display = "block";


    progressBar.style.width =
      "100%";


    stepNumber.textContent =
      TOTAL_QUESTIONS;


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/* =========================================
   BUILD REVIEW
========================================= */

function buildReview() {

  reviewContent.innerHTML = "";


  const fields = [

    {
      label: "Page Type",
      name: "Page Type"
    },

    {
      label: "Main Goal",
      name: "Main Goal"
    },

    {
      label: "What They Offer",
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
      label: "Name",
      name: "Name"
    },

    {
      label: "Email",
      name: "Email"
    }

  ];


  fields.forEach(
    fieldInfo => {

      const field =
        intakeForm.elements[
          fieldInfo.name
        ];


      let value = "";


      /*
        Radio field.
      */

      if (
        field instanceof RadioNodeList
      ) {

        const selected =
          Array.from(field)
            .find(
              radio => radio.checked
            );

        value =
          selected
            ? selected.value
            : "";

      } else {

        value =
          field.value.trim();

      }


      createReviewItem(
        fieldInfo.label,
        value
      );

    }
  );
}


/* =========================================
   REVIEW ITEM
========================================= */

function createReviewItem(
  label,
  value
) {

  const item =
    document.createElement("div");

  item.className =
    "review-item";


  const labelElement =
    document.createElement("div");

  labelElement.className =
    "review-label";

  labelElement.textContent =
    label;


  const valueElement =
    document.createElement("div");

  valueElement.className =
    "review-value";

  valueElement.textContent =
    value || "Not provided";


  item.appendChild(
    labelElement
  );

  item.appendChild(
    valueElement
  );


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

    /*
      Return to the contact section
      so the user can move backward
      through the form.
    */

    currentStep = contactStep;

    showStep(currentStep);

  }
);


/* =========================================
   FORM SUBMISSION
========================================= */

intakeForm.addEventListener(
  "submit",
  event => {

    /*
      Do NOT preventDefault here.

      The browser will submit the form
      to FormSubmit once the email
      address is configured.

      FormSubmit then handles the
      email delivery.
    */

    const formData =
      new FormData(intakeForm);


    const name =
      formData.get("Name");


    if (!name) {

      event.preventDefault();

      window.alert(
        "Please enter your name."
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


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/* =========================================
   PWA INSTALL SUPPORT
========================================= */

let deferredInstallPrompt = null;


window.addEventListener(
  "beforeinstallprompt",
  event => {

    /*
      Save the browser's install prompt.
    */

    event.preventDefault();

    deferredInstallPrompt = event;

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
              "WebBuild service worker registered."
            );

          }
        )
        .catch(
          error => {

            console.error(
              "Service worker registration failed:",
              error
            );

          }
        );

    }
  );

}


/* =========================================
   INITIALIZE
========================================= */

questions.forEach(
  question => {

    question.style.display =
      "none";

  }
);


/*
  Keep the intro visible when
  the application first loads.
*/

introScreen.classList.add(
  "active"
);

progressBar.style.width =
  "20%";

stepNumber.textContent =
  "1";
