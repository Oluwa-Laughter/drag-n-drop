interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validateInput: Validatable) {
  let isValid = true;

  if (validateInput.required)
    isValid = isValid && validateInput.value.toString().trim().length !== 0;

  if (
    validateInput.minLength != null &&
    typeof validateInput.value === "string"
  )
    isValid = isValid && validateInput.value.length > validateInput.minLength;

  if (
    validateInput.maxLength != null &&
    typeof validateInput.value === "string"
  )
    isValid = isValid && validateInput.value.length < validateInput.maxLength;

  if (validateInput.min != null && typeof validateInput.value === "number")
    isValid = isValid && validateInput.value > validateInput.min;

  if (validateInput.max != null && typeof validateInput.value === "number")
    isValid = isValid && validateInput.value < validateInput.max;

  return isValid;
}

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
