export default class Component {
    constructor(templateElId, hostElId, insertAtStart, newElId) {
        this.templateEl = document.getElementById(templateElId);
        this.hostEl = document.getElementById(hostElId);
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        if (newElId)
            this.element.id = newElId;
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        this.hostEl.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
    }
}
//# sourceMappingURL=base-component.js.map