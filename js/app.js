import { RegistrationView } from "./views/RegistrationView.js";
import { SurveyView } from "./views/SurveyView.js";
import { ResultsView } from "./views/ResultsView.js";
import { UserManager } from "./modules/UserManager.js";
import { ResultsCalculator } from "./modules/ResultsCalculator.js";
import { QuestionManager } from "./modules/QuestionManager.js";

class App {
  constructor() {
    this.state = {
      currentView: "registration",
      userData: null,
      answers: [],
      questions: [],
      currentQuestionIndex: 0,
    };

    this.userManager = new UserManager();
    this.resultsCalculator = new ResultsCalculator();
    this.views = {
      registration: new RegistrationView(this),
      survey: new SurveyView(this),
      results: new ResultsView(this),
    };

    this.init();
  }

  init() {
    this.render();
    window.addEventListener("hashchange", () => this.handleRouteChange());
  }

  getCurrentQuestion() {
    return this.state.questions[this.state.currentQuestionIndex];
  }

  getProgress() {
    return {
      current: this.state.currentQuestionIndex + 1,
      total: this.state.questions.length,
    };
  }

  addAnswer(answer) {
    this.state.answers.push(answer);
    this.state.currentQuestionIndex++;
  }

  navigateTo(view) {
    // При переходе на survey сбрасываем состояние
    if (view === "survey") {
      this.state.currentQuestionIndex = 0;
      this.state.answers = [];
    }

    this.state.currentView = view;
    window.location.hash = view;
    this.render();
  }

  handleRouteChange() {
    const viewName = window.location.hash.replace("#", "") || "registration";
    this.navigateTo(viewName);
  }

  render() {
    const view = this.views[this.state.currentView];
    if (view) {
      document.getElementById("app").innerHTML = view.render();
      view.afterRender();
    }
  }

  // State management methods
  setUserData(data) {
    this.state.userData = data;
    this.state.questions =
      data.skillLevel === "beginner"
        ? QuestionManager.beginnerQuestions
        : QuestionManager.masterQuestions;
  }

  addAnswer(answer) {
    this.state.answers.push(answer);
  }

  resetTest() {
    this.state = {
      currentView: "registration",
      userData: null,
      answers: [],
      questions: [],
      currentQuestionIndex: 0,
    };
  }

  getCurrentQuestion() {
    return this.state.questions[this.state.answers.length];
  }

  getProgress() {
    return {
      current: this.state.answers.length + 1,
      total: this.state.questions.length,
    };
  }
}

// Initialize the app
new App();
