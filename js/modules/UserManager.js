export class UserManager {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("surveyUsers")) || [];
  }

  registerUser(name, email, skillLevel) {
    const user = {
      id: this.generateId(),
      name,
      email,
      skillLevel,
      registrationDate: new Date(),
      lastTestDate: new Date(),
    };

    this.users.push(user);
    this.saveUsers();
    return user;
  }

  saveUsers() {
    localStorage.setItem("surveyUsers", JSON.stringify(this.users));
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}
