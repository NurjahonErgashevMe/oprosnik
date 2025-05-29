export class RegistrationView {
  constructor(app) {
    this.app = app;
  }

  render() {
    return `
            <div class="registration-view">
                <header class="header">
                    <h1 class="header__title">Профессиональный опрос</h1>
                    <p>Пожалуйста, зарегистрируйтесь для участия</p>
                </header>
                
                <div class="card">
                    <form id="registrationForm" class="form">
                        <div class="form-group">
                            <label for="name" class="form-label">Ваше имя</label>
                            <input type="text" id="name" class="form-input" required aria-required="true">
                        </div>
                        
                        <div class="form-group">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" id="email" class="form-input" required aria-required="true">
                        </div>
                        
                        <div class="form-group">
                            <label for="skillLevel" class="form-label">Уровень навыков</label>
                            <select id="skillLevel" class="form-select" required aria-required="true">
                                <option value="">Выберите уровень</option>
                                <option value="beginner">Начинающий (30 вопросов)</option>
                                <option value="master">Мастер (40 вопросов)</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn--primary">Начать опрос</button>
                    </form>
                </div>
            </div>
        `;
  }

  afterRender() {
    document
      .getElementById("registrationForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();

        const userData = {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          skillLevel: document.getElementById("skillLevel").value,
        };

        this.app.setUserData(userData);
        this.app.navigateTo("survey");
      });
  }
}
