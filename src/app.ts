// Project Type

enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];

  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new ProjectState();

    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );

    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Validation

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

// Auto Bind

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

// Component Base Class

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateElId: string,
    hostElId: string,
    insertAtStart: boolean,
    newElId?: string
  ) {
    this.templateEl = document.getElementById(
      templateElId
    )! as HTMLTemplateElement;

    this.hostEl = document.getElementById(hostElId)! as T;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.element = importedNode.firstElementChild as U;

    if (newElId) this.element.id = newElId;

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostEl.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure?(): void;
  abstract renderContent(): void;
}

// Project Item Class

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);

    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure(): void {}

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;

    this.element.querySelector("h3")!.textContent =
      this.project.people.toString();

    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

//  Project List class

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];

    this.configure();

    this.renderContent();
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((proj) => {
        if (this.type === "active") return proj.status === ProjectStatus.Active;

        return proj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;

      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;

    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = "";

    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
    }
  }
}

// Project Input Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const projectInput = new ProjectInput();
const activeProject = new ProjectList("active");
const finishedProject = new ProjectList("finished");
