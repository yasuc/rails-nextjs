import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Modal } from "@mui/material";
import { Book } from "../types/types";

interface BookEditorProps {
  book: Book;
  open: boolean;
  onSaveHandler: (id: number, title: string, content: string) => Promise<void>;
}

const BookEditor: React.FC<BookEditorProps> = ({ book, open, onSaveHandler }) => {
  const [title, setTitle] = useState(book.title);
  const [content, setContent] = useState(book.body);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const id = book.id;

  // book が変わった時に title と content を更新
  useEffect(() => {
    setTitle(book.title);
    setContent(book.body);
  }, [book]);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSaveHandler(id, title, content);
    } catch (err) {
      setError("保存に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 600,
          width: "100%",
          padding: 3,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          boxShadow: 3,
        }}
        tabIndex={0}
      >
        <TextField
          label="本のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="本の内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={6}
          variant="outlined"
          fullWidth
        />
        {error && <Box sx={{ color: "red" }}>{error}</Box>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          disabled={loading} // 保存中はボタンを無効化
        >
          {loading ? "保存中..." : "保存"}
        </Button>
      </Box>
    </Modal>
  );
};

export default BookEditor;
