"use strict";
class App {
    constructor() {
        this.templateEl = document.getElementById("project-input");
        this.hostEl = document.getElementById("app");
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        this.attach();
    }
    attach() {
        this.hostEl.insertAdjacentElement("afterbegin", this.element);
    }
}
const app = new App();
//# sourceMappingURL=app.js.map