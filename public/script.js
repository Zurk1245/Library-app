// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


var firebaseConfig = {
    apiKey: "AIzaSyD0eNa0NVduxk-lcfw0zi3mOoWoeKCYQ7A",
    authDomain: "biblioteca-virtual-c4262.firebaseapp.com",
    projectId: "biblioteca-virtual-c4262",
    databaseURL: "https://biblioteca-virtual-c4262-default-rtdb.firebaseio.com/",
    storageBucket: "biblioteca-virtual-c4262.appspot.com",
    messagingSenderId: "539189863716",
    appId: "1:539189863716:web:2f05daaff1bf00e8807fb1",
    measurementId: "G-NGLPR48XVZ",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

//console.log(database)

let body = document.querySelector('body');
let bookList = document.getElementById('book-list');
let addBookButton = document.getElementById('add-book')

let library = [];

function Book(title, author, pages, date, score) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.date = date;
    this.score = score;
    this.info = function() {
        return `${title} by ${author}, ${pages} pages, ${read}.`;
    } 
}

/*function displayLibrary() {
    library.map(book => {
        let title = document.createElement('p')
        title.textContent = book.title;
        bookList.insertBefore(title, addBookButton);

        let author = document.createElement('p');
        author.textContent = book.author;
        bookList.insertBefore(author, addBookButton);

        let pages = document.createElement('p');
        pages.textContent = book.pages;
        bookList.insertBefore(pages, addBookButton);

        let dateOfReading = document.createElement('p');
        dateOfReading.textContent = book.date;
        bookList.insertBefore(dateOfReading, addBookButton);

        let score = document.createElement('p');
        score.textContent = book.score;
        bookList.insertBefore(score, addBookButton);
    })
}*/

function displayLibrary() {
    if (library.length === 0) return;
    let bookToDisplay = library[library.length - 1];

    let row = document.createElement('div');
    row.className = 'row';
    bookList.insertBefore(row, addBookButton);
  
    let title = document.createElement('p')
    title.textContent = bookToDisplay.title;
    row.appendChild(title);

    let author = document.createElement('p');
    author.textContent = bookToDisplay.author;
    row.appendChild(author);

    let pages = document.createElement('p');
    pages.textContent = bookToDisplay.pages;
    row.appendChild(pages);

    let dateOfReading = document.createElement('p');
    dateOfReading.textContent = bookToDisplay.date;
    row.appendChild(dateOfReading);

    let score = document.createElement('p');
    score.textContent = bookToDisplay.score;
    row.appendChild(score);    

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-button';
    row.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
        bookList.removeChild(row);
    })  
}

function addBookToLibrary(title, author, pages, date, score) {
    let bookToAddToTheLibraryList = new Book(title, author, pages, date, score);
    library.push(bookToAddToTheLibraryList);
}


addBookButton.addEventListener('click', () => {
    let formContainer = document.createElement('form');
    formContainer.className = 'form-container';
    body.appendChild(formContainer);
    let addForm = document.createElement('div');
    addForm.className = 'add-form';
    formContainer.appendChild(addForm);

    function createInput(labelName, inputNumber, inputType) {
        let label = document.createElement('label');
        label.setAttribute('for', inputNumber);
        label.className = 'label';
        label.textContent = labelName;

        let input = document.createElement('input');
        input.className = 'input';
        input.setAttribute('id', inputNumber);
        input.setAttribute('type', inputType);

        if (inputType === 'range') {
            input.setAttribute('min', '1');
            input.setAttribute('max', '6');
        }
        
        addForm.appendChild(label);
        //addForm.appendChild(document.createElement('br'));
        addForm.appendChild(input);   
        addForm.appendChild(document.createElement('br')); 
    }

    createInput('Libro', 'input1', 'text');
    createInput('Autor', 'input2', 'text');
    createInput('Páginas', 'input3', 'number');
    createInput('Fecha de lectura', 'input4', 'text');
    /*createInput('Calificación', 'input5', 'range');*/

    let calificationLabel = document.createElement('label');
    calificationLabel.textContent = 'Calificación';
    calificationLabel.className = 'label';
    addForm.appendChild(calificationLabel);

    addForm.appendChild(document.createElement('br'));

    let rangeDiv = document.createElement('div');
    rangeDiv.className = 'range';
    addForm.appendChild(rangeDiv);

    let sliderValue = document.createElement('div');
    sliderValue.className = 'sliderValue';
    rangeDiv.appendChild(sliderValue);

    let spanInSliderValue = document.createElement('span');
    spanInSliderValue.innerHTML = '3';
    sliderValue.appendChild(spanInSliderValue);

    let field = document.createElement('div');
    field.className = 'field';
    rangeDiv.appendChild(field);

    let valueLeft = document.createElement('div');
    valueLeft.textContent = '1';
    valueLeft.classList.add('value', 'left');
    field.appendChild(valueLeft);

    let rangeInput = document.createElement('input');
    rangeInput.id = 'input';
    rangeInput.setAttribute('type', 'range');
    rangeInput.setAttribute('min', '1');
    rangeInput.setAttribute('max', '5')
    rangeInput.setAttribute('value', '3');
    rangeInput.setAttribute('steps', '1');
    field.appendChild(rangeInput);

    let valueRight = document.createElement('div');
    valueRight.textContent = '5';
    valueRight.classList.add('value', 'right');
    field.appendChild(valueRight);

    const slideValue = document.querySelector("span");
    const inputSlider = document.getElementById("input");
    inputSlider.oninput = (()=>{
        let value = inputSlider.value;
        slideValue.textContent = value;
        switch (value) {
            case '1': 
                slideValue.style.left = (value*13.2) + "%";
                break;
            case '2':
                slideValue.style.left = (value*18.3) + "%";
                break;
            case '3': 
            slideValue.style.left = (value*19.8) + "%";
                break;   
            case '4': 
            slideValue.style.left = (value*20.6) + "%";
                break;                           
            case '5':
                slideValue.style.left = (value*21.2) + "%";
                break;
        }
        slideValue.classList.add("show");
    });
    inputSlider.onblur = (()=>{
        slideValue.classList.remove("show");
    });

    //addForm.appendChild(document.createElement('br'));
    addForm.appendChild(document.createElement('br'));



    let buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'buttonsContainer';
    addForm.appendChild(buttonsContainer);

    let cancelButton = document.createElement('button');
    cancelButton.id = 'cancelButton';
    cancelButton.textContent = 'Cancelar';
    buttonsContainer.appendChild(cancelButton);
    cancelButton.addEventListener('click', () => {
        body.removeChild(formContainer);
    })

    let pushBookButton = document.createElement('button');
    pushBookButton.id = 'pushBookButton';
    pushBookButton.textContent = 'Agregar';
    buttonsContainer.appendChild(pushBookButton);
    pushBookButton.addEventListener('click', () => {
        let input1 = document.getElementById('input1');
        let input2 = document.getElementById('input2');
        let input3 = document.getElementById('input3');
        let input4 = document.getElementById('input4');
        let input5 = document.getElementById('input');
        //Se agrega el libro al array library
        addBookToLibrary(input1.value, input2.value, input3.value, input4.value, input5.value);
        displayLibrary();
        //De library se manda a la base de datos
        // Get a reference to the database service
        var database = firebase.database().ref('Libros');
        let book = database.push();
        book.set({
            nombre: input1.value,
            autor: input2.value,
            páginas: input3.value,
            fecha_de_lectura: input4.value,   
            calificación: input5.value,
        });
        body.removeChild(formContainer);

    })
})



addBookToLibrary('Atomic Habits', 'James Clear', 320, '01/03/2021', 3);
console.log(library);
displayLibrary();

//const atomicHabits = new Book('Atomic Habits', 'James Clear', 320, '01/03/2021', 3);
//console.log(atomicHabits.info())
