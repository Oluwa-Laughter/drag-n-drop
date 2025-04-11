function AutoBind(_: any, __: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,

    get() {
      const boundFn = originalMethod.bind(this);

      return boundFn;
    },
  };

  return adjustedDescriptor;
}

class App {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputEl = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;

    this.descriptionInputEl = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;

    this.peopleInputEl = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.config();

    this.attach();
  }

  private allUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDescription = this.descriptionInputEl.value;
    const enteredPeople = this.peopleInputEl.value;

    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
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
    console.log(this);
    const userInput = this.allUserInput();

    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private config() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element);
  }
}

const app = new App();
