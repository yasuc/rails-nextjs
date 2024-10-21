"use client";

import React, { useState, useEffect } from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import axios from "axios";
import BookEditor from "../componets/BookEditor";
import BookDetailModal from "../componets/BookDetailModal";
import { Book } from "../types/types";

const BookIndex: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editedBook, setEditedBook] = useState<Book | null>(null);
  const [openEditor, setOpenEditor] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/books");
        setBooks(response.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  const handleEditBook = (book: Book) => {
    setEditedBook(book);
    setOpenEditor(true);
  };

  const handleShowDetails = (book: Book) => {
    setSelectedBook(book);
    setOpenDetail(true);
  };

  const handleSave = async (id: number, title: string, content: string) => {
    try {
      await axios.patch(`http://localhost:3000/books/${id}`, { title, body: content });
      setBooks(books.map((book) => (book.id === id ? { ...book, title, body: content } : book)));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error saving book:", error);
    }
  };

  const deleteBook = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting book:", error);
    }
  };

  return (
    <>
      <Typography variant="h4" align="center">
        Book List
      </Typography>
      <TableContainer>
        <Table sx={{ maxWidth: 700 }} align="center">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Body</TableCell>
              <TableCell align="center" colSpan={3}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.body}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleShowDetails(book)}>
                    Show
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<ModeEditIcon />}
                    onClick={() => handleEditBook(book)}>
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteForeverIcon />}
                    onClick={() => deleteBook(book.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editedBook && (
        <BookEditor
          book={editedBook}
          open={openEditor}
          onSave={handleSave}
          onClose={() => setOpenEditor(false)}
        />
      )}

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          open={openDetail}
          onClose={() => setOpenDetail(false)}
        />
      )}
    </>
  );
};

export default BookIndex;
