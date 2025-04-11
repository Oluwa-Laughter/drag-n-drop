"use strict";
class App {
    constructor() {
        this.templateEl = document.getElementById("project-input");
        this.hostEl = document.getElementById("app");
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.titleInputEl = this.element.querySelector("#title");
        this.descriptionInputEl = this.element.querySelector("#description");
        this.peopleInputEl = this.element.querySelector("#people");
        this.config();
        this.attach();
    }
    submitHandler(e) {
        e.preventDefault();
        console.log(this);
    }
    config() {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    }
    attach() {
        this.hostEl.insertAdjacentElement("afterbegin", this.element);
    }
}
const app = new App();
//# sourceMappingURL=app.js.map