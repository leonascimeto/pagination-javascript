const data = Array.from({length: 100})
.map((_, index) => `Item ${index+1}`);

//================================================

const html = {
  get(element){
    return document.querySelector(element);
  }
}

const perPage = 5;
const state = {
  pageActing: 1,
  perPage,
  totalPages: Math.ceil(data.length / perPage),
  maxVisiblesButton: 5
}

const controls = {
  next(){
    (state.pageActing < state.totalPages) && state.pageActing++;
  },
  prev(){
    (state.pageActing > 1) && state.pageActing--;
  },
  goTo(page){
    if(page <= state.totalPages && page > 0)
      state.pageActing = +page;
  },
  createListeners(){
    html.get('.first').addEventListener('click', ()=> {
      controls.goTo(1);
      update();
    });
    html.get('.last').addEventListener('click', ()=> {
      controls.goTo(state.totalPages);
      update();
    });
    html.get('.prev').addEventListener('click', ()=> {
      controls.prev();
      update();
    });
    html.get('.next').addEventListener('click', ()=> {
      controls.next();
      update();
    });
  }
}

const list = {
  create(item){
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = item;
    html.get(".list").appendChild(div);
  },
  update(){
    html.get(".list").innerHTML = "";

    let page = state.pageActing - 1;
    let start = page * state.perPage;
    let end = start + state.perPage;

    const paginatedItems = data.slice(start, end);

    paginatedItems.forEach(list.create);

  }
}

const buttons = {
  element: html.get("#paginate .numbers"),
  create(number){
    const button = document.createElement("div");

    button.innerHTML = number;

    if(state.pageActing === number) 
      button.classList.add("active")

    button.addEventListener("click", event => {
      const page = event.target.innerText;

      controls.goTo(page);
      update();
    })

    buttons.element.appendChild(button)
  },
  update(){
    buttons.element.innerHTML = "";
    const {maxLeft, maxRight} = buttons.maxVisible();

    for(let page = maxLeft; page <= maxRight; page++){
      buttons.create(page);
    }

  },
  maxVisible(){
    const {maxVisiblesButton, pageActing, totalPages} = state;
    let maxLeft = (pageActing - Math.floor(maxVisiblesButton / 2));
    let maxRight = (pageActing + Math.floor(maxVisiblesButton / 2))
    
    if(maxLeft < 1){
      maxLeft = 1;
      maxRight = maxVisiblesButton;
    }

    if(maxRight > totalPages){
      maxLeft = totalPages - (maxVisiblesButton - 1);
      maxRight = totalPages;
      if(maxLeft < 1) maxLeft = 1;
    }

    return {maxLeft, maxRight}
  }
}

function update(){
  list.update();
  buttons.update();
}

function init(){
  update();
  controls.createListeners();
}

init()