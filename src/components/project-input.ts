/*
/// <reference path="base-component.ts"/>
/// <reference path="../utils/validation.ts"/>
/// <reference path="../decorators/autobind.ts"/>
*/

import { AutoBind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import { Validatable, validate } from "../utils/validation.js";
import { Component } from "./base-component.js";

// Project Input Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.configure();

    this.titleInputEl = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;

    this.descriptionInputEl = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;

    this.peopleInputEl = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent(): void {}

  private allUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDescription = this.descriptionInputEl.value;
    const enteredPeople = this.peopleInputEl.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +enteredTitle,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) &&
      !validate(descValidatable) &&
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    }

    return [enteredTitle, enteredDescription, +enteredPeople];
  }

  private clearInputs() {
    this.titleInputEl.value = "";
    this.descriptionInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  @AutoBind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.allUserInput();

    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}
