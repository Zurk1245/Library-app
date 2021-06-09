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

function displayLibrary() {
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
}

function addBookToLibrary(title, author, pages, date, score) {
    let bookToAddToTheLibraryList = new Book(title, author, pages, date, score);
    library.push(bookToAddToTheLibraryList);
}

addBookButton.addEventListener('click', () => {
    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    body.appendChild(buttonContainer);
    let addForm = document.createElement('div');
    addForm.className = 'add-form';
    buttonContainer.appendChild(addForm);

    function createInput(labelName, inputNumber, inputType) {
        let label = document.createElement('label');
        label.setAttribute('for', inputNumber);
        label.textContent = labelName;

        let input = document.createElement('input');
        input.setAttribute('id', inputNumber);
        input.setAttribute('type', inputType);

        if (inputType === 'range') {
            input.setAttribute('min', '1');
            input.setAttribute('max', '6');
        }
        
        addForm.appendChild(label);
        addForm.appendChild(document.createElement('br'));
        addForm.appendChild(input);   
        addForm.appendChild(document.createElement('br')); 
    }

    createInput('Libro', 1, 'text');
    createInput('Autor', 2, 'text');
    createInput('Páginas', 3, 'number');
    createInput('Fecha de lectura', 4, 'date');
    createInput('Calificación', 5, 'range');

    let buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'buttonsContainer';
    addForm.appendChild(buttonsContainer);

    let cancelButton = document.createElement('button');
    cancelButton.id = 'cancelButton';
    cancelButton.textContent = 'Cancelar';
    buttonsContainer.appendChild(cancelButton);
    cancelButton.addEventListener('click', () => {
        body.removeChild(buttonContainer);
    })

    let pushBookButton = document.createElement('button');
    pushBookButton.id = 'pushBookButton';
    pushBookButton.textContent = 'Agregar';
    buttonsContainer.appendChild(pushBookButton);


})


addBookToLibrary('Atomic Habits', 'James Clear', 320, '01/03/2021', 3);

displayLibrary();

//const atomicHabits = new Book('Atomic Habits', 'James Clear', 320, '01/03/2021', 3);
//console.log(atomicHabits.info())