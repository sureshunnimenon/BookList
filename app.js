console.log("connected"); // for checking

// book class 
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

    // any methods later
    // any property later
}

// UI class - usually in separate view folder
class UI {
    static displayBooks(){
        // const StoredBooks = [
        //     {
        //         title:'a  book',
        //         author: "sure",
        //         isbn: "a12345"
        //     },

        //     {
        //         title:"second book",
        //         author: "sure again",
        //         isbn: "b123459876"

        //     }
        // ]; 
 
        // const books = StoredBooks;   
        // above was for testing ony-- removed after testing

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));    
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td> ${book.title} </td>
            <td> ${book.author} </td>
            <td> ${book.isbn} </td>
            <td> <a href='#' class="btn btn-danger btn-sm delete"> X </a> </td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();

            // display info
            UI.showAlerts('The book selected is removed', 'info');
        }
    }

    static showAlerts(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        // make it vanish in fe seconds 
        setTimeout(()=> document.querySelector('.alert').remove(), 3000);
            
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }
}

// storage class - usually Model folder

class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }

    static removeBook(isbn){
        const books = Store.getBooks();
        // loop through array of books and remove the book with the passed parameter isbn record
        books.forEach((book, index) => {
            if(book.isbn.trim() == isbn.trim())){
                books.splice(index, 1);
                // console.log(books);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// events class -usually in separate controller folder
// display books
document.addEventListener('DOMContentLoaded',UI.displayBooks);


// add a book
document.querySelector('#book-form').addEventListener('submit', (event)=> {
    // prevent actual submit
    event.preventDefault();

    // get form values
    const title= document.querySelector('#title').value;
    const author= document.querySelector('#author').value;
    const isbn= document.querySelector('#isbn').value;

    // validation of form fields
    if(title === '' || author === '' || isbn === ''){
        // alert("please fill in all fields")

        UI.showAlerts('Please fill in all fields', 'danger');
    }

    else {
        // instantiate book from book class
        const book = new Book(title, author, isbn);
        // console.log(book);

        // call method to add the book
        UI.addBookToList(book);

        // add book to store
        Store.addBook(book);

        // clear fields
        UI.clearFields();

        // show success message
        UI.showAlerts('the Record is succesfully inserted', 'success');
    }   
    
})

// remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    console.log(e.target);
    UI.deleteBook(e.target);
    console.log(e.target.parentElement.previousElementSibling.textContent)

    // remove from local storate
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
    
})



