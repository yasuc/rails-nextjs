"use client";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Box,
  Modal,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import axios from "axios";
import { useEffect, useState } from "react";
import BookEditor from "../componets/book_editor";
import { Book } from "../types/types";

const BookIndex = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [editedBookId, setEditedBookId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

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

  const selectedBook = books.find((book) => book.id === selectedBookId);
  const editedBook = books.find((book) => book.id === editedBookId);

  const handleShowDetails = (id?: number) => {
    setSelectedBookId(id || null);
    if (!id) setOpen(false); // モーダルを閉じたときにリセット
  };

  const handleEditBook = (id?: number) => {
    setEditedBookId(id || null);
    if (!id) setOpen(false); // モーダルを閉じたときにリセット
  };

  const handleSaveAndClose = async (id: number, title: string, content: string) => {
    await saveBook(id, title, content);
    setOpen(false);
  };

  const saveBook = async (id: number, title: string, body: string) => {
    try {
      await axios.patch(`http://localhost:3000/books/${id}`, { title, body });
      setBooks(books.map((book) => (book.id === id ? { ...book, title, body } : book)));
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
        <Table sx={{ maxWidth: 650 }} align="center">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Body</TableCell>
              <TableCell colSpan={3}></TableCell>
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
                    onClick={() => {
                      handleShowDetails(book.id);
                      setOpen(true);
                    }}
                  >
                    SHOW
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<ModeEditIcon />}
                    onClick={() => {
                      handleEditBook(book.id);
                      setOpen(true);
                    }}
                  >
                    EDIT
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteForeverIcon />}
                    onClick={() => deleteBook(book.id)}
                  >
                    DESTROY
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editedBook && (
        <BookEditor book={editedBook} open={open} onSaveHandler={handleSaveAndClose} />
      )}

      {selectedBook && (
        <Modal open>
          <Box
            sx={{
              position: "absolute" as const,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "lightblue",
              p: 4,
              borderRadius: "0.5em",
            }}
          >
            <Box component="p">ID: {selectedBook.id}</Box>
            <Box component="p">Title: {selectedBook.title}</Box>
            <Box component="p">Body: {selectedBook.body}</Box>
            <Box component="p">CreatedAt: {selectedBook.created_at}</Box>
            <Box component="p">UpdatedAt: {selectedBook.updated_at}</Box>
            <Button onClick={() => handleShowDetails()} variant="contained">
              Close ✖️
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default BookIndex;
