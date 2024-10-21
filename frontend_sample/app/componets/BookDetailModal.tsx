import React from "react";
import { Box, Button, Modal } from "@mui/material";
import { Book } from "../types/types";

interface BookDetailModalProps {
  book: Book;
  open: boolean;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
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
        <Box component="p">ID: {book.id}</Box>
        <Box component="p">Title: {book.title}</Box>
        <Box component="p">Body: {book.body}</Box>
        <Box component="p">CreatedAt: {book.created_at}</Box>
        <Box component="p">UpdatedAt: {book.updated_at}</Box>
        <Button onClick={onClose} variant="contained">
          Close ✖️
        </Button>
      </Box>
    </Modal>
  );
};

export default BookDetailModal;
