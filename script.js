function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        return `${title} by ${author}, ${pages} pages, ${read}.`;
    } 
}

const atomicHabits = new Book('Atomic Habits', 'James Clear', 320, 'read');

console.log(atomicHabits.info());