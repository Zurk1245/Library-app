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
let currentBookList = bookList.querySelectorAll('.row');
let addBookButton = document.getElementById('add-book');
let signInButton = document.getElementById('signInButton');
let logOutButton = document.getElementById('logOutButton');
let docId = 0;
let bookIdFromDataBase;
let currentUserId = undefined;
let auth = firebase.auth();

//FOR RESPONSIVE DESIGN
let height = screen.height;
let width = screen.width;

//SIGN IN
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
    firebase.auth().signOut().then(() => {
        currentUserId = undefined;  
    }).catch(err => {
        console.log(err);
    })
})

function updateStatistics() {
    let booksQuantity = document.getElementById('booksQuantity');
    let currentBookList = document.querySelectorAll('.row');
    let totalPages = document.getElementById('totalPages');    
    let averageCalification = document.getElementById('averageCalification');

    if (currentBookList.length === 0) {
        averageCalification.textContent = '0';
        booksQuantity.textContent = '0';
        totalPages.textContent = '0';
        return;
    };
    let books = currentBookList.length;
    booksQuantity.textContent = books;

    let pages = 0;
    db.collection('users').doc(currentUserId).collection('Books').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            pages += parseFloat(doc.data().páginas);
        })
        totalPages.textContent = pages;
    });

    let average = 0;
    db.collection('users').doc(currentUserId).collection('Books').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            average += parseFloat(doc.data().calificación);
        })
        average = average / currentBookList.length;
        averageCalification.textContent = Math.round((average + Number.EPSILON) * 100) / 100;    
    });
}

let storeYourDataMessage = document.createElement('div');
storeYourDataMessage.innerHTML = '<p class="storeYourDataMessage">¡Inicie sesión para guardar sus libros!</p>';
storeYourDataMessage.style.cssText = 'font-weight: bold; font-size: 1.4em; margin: 10px auto;';

function checkLogin(user) {
        if (user) {
        signInButton.style.display = 'none';
        logOutButton.style.display = 'block';
        if (storeYourDataMessage.style.display == 'block') {
            bookList.removeChild(storeYourDataMessage);
        } 

    } else {
        signInButton.style.display = 'block';
        logOutButton.style.display = 'none';
        storeYourDataMessage.style.display = 'block';
        bookList.insertBefore(storeYourDataMessage, addBookButton);
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
            if (doc.data().nombre === undefined) {return}
             addBookToLibrary(
                doc.data().nombre,
                doc.data().autor,
                doc.data().páginas, 
                doc.data().fecha_de_lectura,
                doc.data().calificación
            )    
             displayLibrary(bookIdFromDataBase);
        })
    }
    return; 
}
//Autenticación y mostrar libros del usuario
auth.onAuthStateChanged(user => {
    if (user) {
        checkLogin(user);
        eliminateBooksFromLibrary();
        currentUserId = user.uid;
        db.collection('users').doc(currentUserId).collection('Books').orderBy('creacion')
        .get()
        .then(snapshot => {
            setUpBooks(snapshot.docs);
            updateStatistics();
        });
        
    } else {
        eliminateBooksFromLibrary();
        checkLogin(user); 
        updateStatistics();
    }
})

function Book(nombre, autor, páginas, fecha_de_lectura, calificación) {
    this.nombre = nombre;
    this.autor = autor;
    this.páginas = páginas;
    this.fecha_de_lectura = fecha_de_lectura;
    this.calificación = calificación;
}

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

    row.appendChild(deleteButton);
 
    //Borrar datos del libro en la base de datos
    deleteButton.addEventListener('click', async () => {
        try {
            await db.collection('users').doc(currentUserId).collection('Books').doc(bookDocId).delete();
        }
        catch(e) {
            console.log(e);
        }
        bookList.removeChild(row);
        updateStatistics();
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
        label.id = 'label-for-' + inputNumber;

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
        let br = document.createElement('br');
        br.id = `br-for-${inputNumber}`;
        br.className = 'br-add-form';
        if (width >= 720) {
            addForm.appendChild(br); 
        }
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
    console.log(width)

    inputSlider.oninput = (()=>{
        let value = inputSlider.value;
        slideValue.textContent = value;
        //Responsive design para los valores violetas de la califiación de los libros
        if (width > 1000) {
            switch (value) {
                case '1': 
                    slideValue.style.left = (value*9.65) + "%";
                    break;
                case '2':
                    slideValue.style.left = (value*16.84) + "%";
                    break;
                case '3': 
                slideValue.style.left = (value*18.96) + "%";
                    break;   
                case '4': 
                slideValue.style.left = (value*20.13) + "%";
                    break;                           
                case '5':
                    slideValue.style.left = (value*20.906) + "%";
                    break;
            }
       } else if (width <= 1000 && width > 900) {
            switch (value) {
                case '1': 
                    slideValue.style.left = (value*10.1) + "%";
                    break;
                case '2':
                    slideValue.style.left = (value*16.92) + "%";
                    break;
                case '3': 
                slideValue.style.left = (value*19.1) + "%";
                    break;   
                case '4': 
                slideValue.style.left = (value*20.3) + "%";
                    break;                           
                case '5':
                    slideValue.style.left = (value*20.906) + "%";
                    break;
            }
        } else if (width <= 900 && width > 590) {
            switch (value) {
                case '1': 
                    slideValue.style.left = (value*13.1) + "%";
                    break;
                case '2':
                    slideValue.style.left = (value*17.92) + "%";
                    break;
                case '3': 
                slideValue.style.left = (value*19.9) + "%";
                    break;   
                case '4': 
                slideValue.style.left = (value*20.6) + "%";
                    break;                           
                case '5':
                    slideValue.style.left = (value*21.06) + "%";
                    break;
            }
        } else if (width <= 590 && width > 552) {
            switch (value) {
                case '1': 
                    slideValue.style.left = (value*14.1) + "%";
                    break;
                case '2':
                    slideValue.style.left = (value*18.92) + "%";
                    break;
                case '3': 
                slideValue.style.left = (value*19.9) + "%";
                    break;   
                case '4': 
                slideValue.style.left = (value*20.6) + "%";
                    break;                           
                case '5':
                    slideValue.style.left = (value*21.06) + "%";
                    break;
            }
        } else if (width <= 552 && width > 405) {
            switch (value) {
                case '1': 
                    slideValue.style.left = (value*18.08) + "%";
                    break;
                case '2':
                    slideValue.style.left = (value*20.212) + "%";
                    break;
                case '3': 
                slideValue.style.left = (value*20.9) + "%";
                    break;   
                case '4': 
                slideValue.style.left = (value*20.96) + "%";
                    break;                           
                case '5':
                    slideValue.style.left = (value*21.806) + "%";
                    break;
            }
        } else if (width <= 405 && width > 390) {
            switch (value) {
                case '1': 
                    slideValue.style.left = (value*19.08) + "%";
                    break;
                case '2':
                    slideValue.style.left = (value*21.212) + "%";
                    break;
                case '3': 
                slideValue.style.left = (value*21.9) + "%";
                    break;   
                case '4': 
                slideValue.style.left = (value*21.96) + "%";
                    break;                           
                case '5':
                    slideValue.style.left = (value*21.806) + "%";
                    break;
            }
        } else if (width <= 390) {
            switch (value) {
                case '1': 
                    slideValue.style.left = (value*23.08) + "%";
                    break;
                case '2':
                    slideValue.style.left = (value*22.212) + "%";
                    break;
                case '3': 
                slideValue.style.left = (value*21.9) + "%";
                    break;   
                case '4': 
                slideValue.style.left = (value*21.96) + "%";
                    break;                           
                case '5':
                    slideValue.style.left = (value*21.806) + "%";
                    break;
            }
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
    pushBookButton.addEventListener('click', e => {
        e.preventDefault();
        let input1 = document.getElementById('input1');
        let input2 = document.getElementById('input2');
        let input3 = document.getElementById('input3');
        let input4 = document.getElementById('input4');
        let input5 = document.getElementById('input');  

        let inputs = document.querySelectorAll('.input');
        let error = false;

        if(input3.value.includes('e')) {
            let alredyMessage = document.getElementById('coloque-num');
            if (alredyMessage) {
                return;
            };
            let insertNumber = document.createElement('p');
            insertNumber.id = 'coloque-num';
            insertNumber.innerHTML = 'Coloque un número';
            insertNumber.style.cssText = 'font-size: .73em; color: black;'
            input3.style.marginBottom = '5px'; 
            let labelForInput4 = document.getElementById('label-for-input4');
            addForm.insertBefore(insertNumber, labelForInput4);
            let brToDestroy = document.getElementById('br-for-input3');
            if(brToDestroy) {
                addForm.removeChild(brToDestroy);
            }
            return;
        }

        inputs.forEach(input => {
            if (input.value == '') {
                error = true;
            }
        });
        if (error === true) {
            let err = document.getElementById('err');
            if(err) {
                return;
            }
            let mensaje = document.createElement('div');
                mensaje.innerHTML = '<p id="err">Recuerde no dejar espacios en blanco</p>';
                mensaje.style.cssText = 'color: white; margin: 0 auto; font-weight: bold; font-size: .8em;'
                let formRef = addForm.querySelector('.label');
                addForm.insertBefore(mensaje, formRef);
                return;
        }

        //Se agrega el libro al array library
        addBookToLibrary(input1.value, input2.value, input3.value, input4.value, input5.value);
        
        //Se manda el libro a la base de datos
        if (currentUserId) {
            db.collection('users').doc(currentUserId).collection('Books').doc(input1.value+input2.value).set({
                nombre: input1.value,
                autor: input2.value,
                páginas: input3.value,
                fecha_de_lectura: input4.value,   
                calificación: input5.value,
                creacion: firebase.firestore.FieldValue.serverTimestamp(),
            });
            displayLibrary(input1.value+input2.value);
            eliminateBooksFromLibrary();
            db.collection('users').doc(currentUserId).collection('Books').orderBy('creacion')
            .get()
            .then(snapshot => {
            setUpBooks(snapshot.docs);
            updateStatistics();
        });
        body.removeChild(formContainer);
        } else {
            displayLibrary();
            body.removeChild(formContainer);
        }

    })
})

//RESPONSIVE DESIGN
let toggle = document.getElementById('toggle');
let toggleLabel = document.querySelector('.toggle-label');

let closeInformation = document.getElementById('closeInformation');
let closeInformationLabel = document.querySelector('.closeInformation-label');

let information = document.getElementById('information-section');
let newInformationContainer = document.createElement('div');
newInformationContainer.className = 'newInformationContainer';
body.insertBefore(newInformationContainer, document.getElementById('nav'));


toggle.addEventListener('click', () => {
    information.classList.add('informationAdapted');
    information.classList.remove('information');
    toggleLabel.style.display = 'none';
    closeInformationLabel.style.display = 'flex';
    newInformationContainer.style.display = 'block';

closeInformation.addEventListener('click', () => {
        information.classList.remove('informationAdapted');
        information.classList.add('information');
        closeInformationLabel.style.display = 'none';
        toggleLabel.style.display = 'flex';
        newInformationContainer.style.display = 'none';
    })
})