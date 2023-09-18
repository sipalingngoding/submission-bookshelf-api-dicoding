const { nanoid } = require("nanoid")
const books = require("./books")

class Handler {
  static postBook(request, h) {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const newBook = {
      id, name, year, author, summary, publisher, pageCount, readPage, reading, insertedAt, updatedAt: insertedAt,
    }
    if (!name) {
      return h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      }).code(400);
    }

    if (readPage > pageCount) {
      return h.response({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      }).code(400);
    }
    newBook.finished = (pageCount === readPage);
    books.push(newBook);
    const isSuccess = books.find((b) => (b.id === id));
    if (isSuccess) {
      return h.response(
        {
          status: "success",
          message: "Buku berhasil ditambahkan",
          data: {
            bookId: newBook.id,
          },
        },
      ).code(201);
    }
    return h.response({
      status: 'error',
      message: "Buku gagal ditambahkan",
    }).code(500);
  }

  static GetAllBooks(request, h) {
    const { name, reading, finished } = request.query
    if (name) {
      const booksName = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()))
      return h.response({
        status: "success",
        data: {
          books: booksName.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher })),
        },
      });
    }
    if (reading) {
      const booksReading = books.filter((b) => b.reading === Boolean(Number(reading) === 1))
      return h.response({
        status: "success",
        data: {
          books: booksReading.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher })),
        },
      })
    }
    if (finished) {
      const booksFinished = books.filter((b) => b.finished === Boolean(Number(finished) === 1))
      return h.response({
        status: "success",
        data: {
          books: booksFinished.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher })),
        },
      })
    }
    return h.response({
      status: "success",
      data: {
        books: books.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher })),
      },
    })
  }

  static GetBookById(request, h) {
    const { bookId } = request.params
    const book = books.find((b) => (b.id === bookId))
    if (!book) {
      return h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
      }).code(404)
    }
    return h.response({
      status: "success",
      data: {
        book,
      },
    }).code(200)
  }

  static updateBook(request, h) {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
    const { bookId } = request.params
    if (!name) {
      return h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      }).code(400)
    }
    if (readPage > pageCount) {
      return h.response({
        status: "fail",
        message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      }).code(400)
    }
    const finished = pageCount === readPage
    const id = books.findIndex((b) => (b.id === bookId))
    if (id === -1) {
      return h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      }).code(404)
    }
    const book = books[id]
    const bookUpdate = { id: bookId, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt: book.insertedAt, updatedAt: new Date().toISOString() }
    books.splice(id, 1, bookUpdate)
    return h.response(
      {
        status: "success",
        message: "Buku berhasil diperbarui",
      },
    ).code(200)
  }

  static deleteBook(request, h) {
    const { bookId } = request.params
    const id = books.findIndex((b) => (b.id === bookId))
    if (id === -1) {
      return h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      }).code(404)
    }
    books.splice(id, 1);
    return h.response(
      {
        status: "success",
        message: "Buku berhasil dihapus",
      },
    ).code(200);
  }
}

module.exports = Handler