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
const db = firebase.firestore();

let library = [];
let body = document.querySelector('body');
let bookList = document.getElementById('book-list');
let addBookButton = document.getElementById('add-book');
let signInButton = document.getElementById('signInButton');
let logOutButton = document.getElementById('logOutButton');
let docId = 0;
let stringId;
let userID;

let bookIdFromDataBase;
let currentUserId = undefined;
let auth = firebase.auth();

signInButton.addEventListener('click', e => {
    e.preventDefault();
    let provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(res => {
            currentUserId = res.user.uid;
            db.collection('users').doc(currentUserId).set({});
        })
});     

logOutButton.addEventListener('click', e => {
    e.preventDefault();
    console.log('apretado!')
    firebase.auth().signOut().then(() => {
        currentUserId = undefined;  
        console.log('logged out!');
    }).catch(err => {
        console.log(err);
    })
})

function checkLogin(user) {
    if (user) {
        signInButton.style.display = 'none';
        logOutButton.style.display = 'block'
    } else {
        signInButton.style.display = 'block';
        logOutButton.style.display = 'none';;
    }
}

function eliminateBooksFromLibrary() {
    let bookList = document.getElementById('book-list');
    let currentBookList = document.querySelectorAll('.row');
    let count = 1;
    for (book of currentBookList){
        if(count > 0){
            bookList.removeChild(book);
        }
        count += 1;
    }   
}

function setUpBooks(data) {
    if (data.length) {
        data.forEach(doc => {
            bookIdFromDataBase = doc.id;
             addBookToLibrary(
                doc.data().nombre,
                doc.data().autor,
                doc.data().páginas, 
                doc.data().fecha_de_lectura,
                doc.data().calificación
            )    
             displayLibrary(bookIdFromDataBase);
        })
    } else {

    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        checkLogin(user);
        eliminateBooksFromLibrary();
        currentUserId = user.uid;
        db.collection('users').doc(currentUserId).collection('Books')
        .get()
        .then(snapshot => {
            setUpBooks(snapshot.docs);
        })
    } else {
        eliminateBooksFromLibrary();
        checkLogin(user); 
    }
    console.log(currentUserId);
})



function Book(nombre, autor, páginas, fecha_de_lectura, calificación) {
    this.nombre = nombre;
    this.autor = autor;
    this.páginas = páginas;
    this.fecha_de_lectura = fecha_de_lectura;
    this.calificación = calificación;
    this.info = function() {
        return `${nombre} by ${autor}, ${páginas} pages, ${read}.`;
    } 
}

/*function displayLibrary() {
    library.map(book => {
        let nombre = document.createElement('p')
        nombre.textContent = book.nombre;
        bookList.insertBefore(nombre, addBookButton);

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

function displayLibrary(bookDocId) {
    if (library.length === 0) return;
    let bookToDisplay = library[library.length - 1];

    let row = document.createElement('div');
    row.className = 'row';
    bookList.insertBefore(row, addBookButton);
  
    let nombre = document.createElement('p')
    nombre.textContent = bookToDisplay.nombre;
    row.appendChild(nombre);

    let autor = document.createElement('p');
    autor.textContent = bookToDisplay.autor;
    row.appendChild(autor);

    let páginas = document.createElement('p');
    páginas.textContent = bookToDisplay.páginas;
    row.appendChild(páginas);

    let fecha = document.createElement('p');
    fecha.textContent = bookToDisplay.fecha_de_lectura;
    row.appendChild(fecha);

    let calificación = document.createElement('p');
    calificación.textContent = bookToDisplay.calificación;
    row.appendChild(calificación);    

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-button';

   /* row.id = bookDocId;
    
    let deleteBtns = document.querySelectorAll('.delete-button');
deleteBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        //Borrar datos del libro en la base de datos
        console.log('clickeado')
        console.log(bookDocId);
        db.collection('users').doc(currentUserId).collection('Books').doc(bookDocId).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });;
        //bookList.removeChild(bookDocId);
        //Hay que ver como se selecciona el libro en cuestión
        //bookInDataBase.remove();
    
    })  
})*/

       deleteButton.addEventListener('click', (e) => {
        //Borrar datos del libro en la base de datos
        console.log('clickeado');
        console.log(bookDocId)
        db.collection('users').doc(currentUserId).collection('Books').doc(bookDocId).delete()
        .then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });;
        bookList.removeChild(row);
        //Hay que ver como se selecciona el libro en cuestión
        //bookInDataBase.remove();

    })  

    row.appendChild(deleteButton);
}

/*function deleteBookFromDataBase(id) {
    db.collection('users').doc(currentUserId).collection('')
}*/

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
        addForm.appendChild(input);   
        addForm.appendChild(document.createElement('br')); 
    }

    createInput('Libro', 'input1', 'text');
    createInput('Autor', 'input2', 'text');
    createInput('Páginas', 'input3', 'number');
    createInput('Fecha de lectura', 'input4', 'text');

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
        
        docId++;
        stringId = docId.toString();
        //Se manda el libro a la base de datos
        if (currentUserId) {
            db.collection('users').doc(currentUserId).collection('Books').doc(input1.value+input2.value).set({
                nombre: input1.value,
                autor: input2.value,
                páginas: input3.value,
                fecha_de_lectura: input4.value,   
                calificación: input5.value,
                //numberId: ,
            });
            displayLibrary(input1.value+input2.value);
        } else {
            displayLibrary();
        }
        

        console.log('Libro añadido!');
        body.removeChild(formContainer);

    })
})

//addBookToLibrary('Atomic Habits', 'James Clear', 320, '01/03/2021', 3);
//displayLibrary();

