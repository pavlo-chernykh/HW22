class ToDoModel {
  constructor() {
    const parse = JSON.parse(localStorage.getItem('todoItem'));
    if (!parse) {
      this.list = [];
    } else {
      this.list = parse;
    }
  }
  add(toDoName, toDoText) {
    const isUnique = this.checkUnique(toDoName, toDoText);
    if (isUnique) {
      const toDoModelCard = {
        toDoName,
        toDoText,
        isComplete: false
      };
      this.list.push(toDoModelCard);
      this.saveToLocalStorage();
    }
  }
  remove(id) {
    this.list = this.list.filter(({toDoName}) => toDoName !== id);
    this.saveToLocalStorage();
  }
  checkUnique(toDoName, toDoText) {
    return !this.list.find(toDoNameNoShd => toDoNameNoShd.toDoName === toDoName || toDoNameNoShd.toDoText === toDoText);
  }
  saveToLocalStorage() {
    localStorage.setItem('todoItem', JSON.stringify(this.list));
  }
  getStat() {
    const modelTotal = this.list.length;
    const one = 1;
    const zero = 0;
    const modelComplete = this.list.reduce((acc, todo) => {
      if (todo.isComplete) {
        // eslint-disable-next-line
        acc += one;
      }
      return acc;
    }, zero);
    const modelNotFinished = modelTotal - modelComplete;
    const statusesCount = {
      modelTotal,
      modelComplete,
      modelNotFinished
    };
    console.log(statusesCount);
    return statusesCount;
  }
}

for (const key in ToDoModel) {
  Object.defineProperty(ToDoModel, key, {
    configurable: false
  });
}

class TodoView {

  constructor(model) {
    this.model = model;
    this.form = document.querySelector('.create-form');
    this.list = document.querySelector('.todo-list');
    this.stat = document.querySelector('.stat-container');
    this.total = document.querySelector('.total');
    this.finished = document.querySelector('.finished');
    this.notFinished = document.querySelector('.not-finished');
  }

  renderList() {
    this.list.innerHTML = '';
    // const {viewTotal, viewComplete, viewLeft} = this.model.getStat();
    // console.log(viewTotal, viewComplete, viewLeft);

    // this.total.textContent = `${viewTotal}`;
    // this.finished.textContent = viewComplete;
    // this.notFinished.textContent = viewLeft;
    // let totalAcc = 0;
    this.notFinished.textContent = this.model.list.length;
    // this.total.textContent = totalAcc += this.notFinished.textContent;

    if(!this.model.list.length) {
      return;
    }
    const fragment = new DocumentFragment();

    for (const toDoModelCard of this.model.list) {

      const listItem = document.createElement('li');
      listItem.classList.add('todo-card');

      const toDoName = document.createElement('div');
      toDoName.classList.add('todo-card__name');
      toDoName.textContent = toDoModelCard.toDoName;

      const toDoText = document.createElement('div');
      toDoText.classList.add('todo-card__task');
      toDoText.textContent = toDoModelCard.toDoText;

      const removeButton = document.createElement('button');
      removeButton.classList.add('todo-card__remove');
      removeButton.textContent = 'Done';
      removeButton.dataset.id = toDoModelCard.toDoName;

      listItem.append(toDoName, toDoText, removeButton);
      fragment.append(listItem);

    }
    this.list.append(fragment);
  }

  // renderStats() {
  //   this.stat.innerHTML = '';
  //   const script = document.querySelector('script');
  //   const viewTotal = 
  //   // const {viewTotal, viewComplete, viewLeft} = this.model.getStat();
  // }

  initSubmit() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const name = formData.get('todoName').trim();
      const text = formData.get('todoText').trim();

      if(name && text) {
        this.model.add(name, text);
        // this.total.textContent = this.model.list.length;
        this.renderList();
        e.target.reset();
      }
    });
  }

  initRemove() {
    this.list.addEventListener('click', ({target: {dataset: {id}}}) => {
      if (id) {
        this.model.remove(id);
        this.finished.textContent = this.totalAcc++;
        this.renderList();
        // this.finished.textContent = this.total.textContent - this.notFinished.textContent;
        console.log(this.totalAcc);
        if (!this.model.list.length) {
          this.total.textContent = 0;
          this.finished.textContent = 0 ;
          this.notFinished.textContent = 0;
        }
      }
    });
  }
}
const tdlm = new ToDoModel();
const tdlv = new TodoView(tdlm);

tdlv.renderList();
// tdlv.renderStats();
tdlv.initSubmit();
tdlv.initRemove();