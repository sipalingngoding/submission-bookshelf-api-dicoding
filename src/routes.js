const Handler = require("./handler")

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: Handler.postBook,
  }, {
    method: "GET",
    path: "/books",
    handler: Handler.GetAllBooks,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: Handler.GetBookById,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: Handler.updateBook,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: Handler.deleteBook,
  },
]

module.exports = routes