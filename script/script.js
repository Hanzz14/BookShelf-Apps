const KEY = "BOOKSHELF_APPS";

let books = [];

function updateJSON(){
    localStorage.setItem(KEY, JSON.stringify(books));
}

function fetchJSON(){
    let data = JSON.parse(localStorage.getItem(KEY));
    if (data !== null) {
        books = data;
    }
    document.dispatchEvent(new Event("onJSONfetched"));
}

const getData = function(){
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

function createBookObject(id, title, author, year, isComplete){
    return{
        id,
        title,
        author,
        year,
        isComplete,
    };
}

function renderFromBooks(){
    for(book of books){
        const newBook = createBook(book.id, book.title, book.author, book.year, book.isComplete);
        if (book.isComplete) {
            document.getElementById(COMPLETE).append(newBook);
        } else {
            document.getElementById(INCOMPLETE).append(newBook);
        }
    }
}

function deleteBook(idBook){
    for(let i=0; i<books.length; i++){
        if (books[i].id == idBook) {
            books.splice(i, 1);
            break;
        }
    }
}

const COMPLETE = "completedBook"
const INCOMPLETE = "unCompletedBook"

const addBook = function(){
    const id = +new Date();
    const title = document.getElementById("input-title").value;
    const author = document.getElementById("input-author").value;
    const year = document.getElementById("input-year").value;
    const isComplete = document.getElementById("input-isComplete").checked;
    const book = createBook(id, title, author, year, isComplete);
    const bookObject = createBookObject(id, title, author, year, isComplete);
    books.push(bookObject);

    if (isComplete === true) {
        document.getElementById(COMPLETE).append(book);
    } else {
        document.getElementById(INCOMPLETE).append(book);
    }
    updateJSON();
}

const createBook = function(id, title, author, year, isComplete){
    const book = document.createElement("article");
    book.setAttribute("id", id);
    book.classList.add("book-item");
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = author;
    const bookYear = document.createElement("p");
    bookYear.innerText = year;
    const container = document.createElement("div");
    const action = addAction(isComplete, id);
    container.append(bookTitle, bookAuthor, bookYear, action);
    book.append(container);
    return book;
}

const addAction = function(isComplete, id){
    const actions = document.createElement("div");
    const actionDelete = createActionDelete(id);
    const actionDone = createActionDone(id);
    const actionUndo = createActionUndo(id);

    actions.append(actionDelete);
    if (isComplete) {
        actions.append(actionUndo);
    } else {
        actions.append(actionDone);
    }

    return actions;
}

const createActionDelete = function(id){
    const actionDelete = document.createElement("button");
    actionDelete.classList.add("delete-button");
    actionDelete.innerHTML = "Hapus"
    actionDelete.addEventListener("click", function(){
        let confirmation = confirm("Apakah Anda Yakin ingin Menghapus Buku ini");
        if (confirmation === true) {
            const idBook = document.getElementById(id);
            idBook.addEventListener("eventDelete", function(event){
                event.target.remove();
            });
            idBook.dispatchEvent(new Event("eventDelete"));
            deleteBook(id);
            updateJSON();
        }
    });
    return actionDelete;
}

const createActionDone = function(id){
    const action = document.createElement("button");
    action.classList.add("done-button");
    action.innerHTML = "Selesai"
    action.addEventListener("click", function(){
        const idBook = document.getElementById(id);
        const bookDataId = getData().filter(a => a.id == id);
        const title = bookDataId[0].title;
        const author = bookDataId[0].author;
        const year = bookDataId[0].year;
        idBook.remove();
        const book = createBook(id, title, author, year, true);
        document.getElementById(COMPLETE).append(book);
        deleteBook(id);
        const bookObject = createBookObject(id, title, author, year, true);
        books.push(bookObject);
        updateJSON();
    })
    return action;
}

const createActionUndo = function(id){
    const action = document.createElement("button");
    action.classList.add("undo-button");
    action.innerHTML = "Kembali"
    action.addEventListener("click", function(){
        const idBook = document.getElementById(id);
        const bookDataId = getData().filter(a => a.id == id);
        const title = bookDataId[0].title;
        const author = bookDataId[0].author;
        const year = bookDataId[0].year;
        idBook.remove();
        const book = createBook(id, title, author, year, true);
        document.getElementById(INCOMPLETE).append(book);
        deleteBook(id);
        const bookObject = createBookObject(id, title, author, year, true);
        books.push(bookObject);
        updateJSON();
    })
    return action;
}

document.addEventListener("DOMContentLoaded", function(){
    const formInput = document.getElementById("input-book");
    formInput.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
        document.getElementById("input-title").value = "";
        document.getElementById("input-author").value = "";
        document.getElementById("input-year").value = "";
        document.getElementById("input-isComplete").checked = false;
    });
    if (typeof Storage == "undefined") {
        alert("Maaf, Browser Anda tidak mendukung layanan Web Storage!");
        return false;
    } else {
        fetchJSON();
    }
});

document.addEventListener("onJSONfetched", function(){
    renderFromBooks();
})