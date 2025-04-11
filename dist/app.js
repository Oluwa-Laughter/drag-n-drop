"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function validate(validateInput) {
    let isValid = true;
    if (validateInput.required)
        isValid = isValid && validateInput.value.toString().trim().length !== 0;
    if (validateInput.minLength != null &&
        typeof validateInput.value === "string")
        isValid = isValid && validateInput.value.length > validateInput.minLength;
    if (validateInput.maxLength != null &&
        typeof validateInput.value === "string")
        isValid = isValid && validateInput.value.length < validateInput.maxLength;
    if (validateInput.min != null && typeof validateInput.value === "number")
        isValid = isValid && validateInput.value > validateInput.min;
    if (validateInput.max != null && typeof validateInput.value === "number")
        isValid = isValid && validateInput.value < validateInput.max;
    return isValid;
}
function AutoBind(_, __, descriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjustedDescriptor;
}
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
    allUserInput() {
        const enteredTitle = this.titleInputEl.value;
        const enteredDescription = this.descriptionInputEl.value;
        const enteredPeople = this.peopleInputEl.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true,
        };
        const descValidatable = {
            value: enteredTitle,
            required: true,
            minLength: 5,
        };
        const peopleValidatable = {
            value: +enteredTitle,
            required: true,
            min: 1,
            max: 5,
        };
        if (!validate(titleValidatable) &&
            !validate(descValidatable) &&
            !validate(peopleValidatable)) {
            alert("Invalid input, please try again!");
            return;
        }
        return [enteredTitle, enteredDescription, +enteredPeople];
    }
    clearInputs() {
        this.titleInputEl.value = "";
        this.descriptionInputEl.value = "";
        this.peopleInputEl.value = "";
    }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.allUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            this.clearInputs();
        }
    }
    config() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    attach() {
        this.hostEl.insertAdjacentElement("afterbegin", this.element);
    }
}
__decorate([
    AutoBind
], App.prototype, "submitHandler", null);
const app = new App();
//# sourceMappingURL=app.js.map