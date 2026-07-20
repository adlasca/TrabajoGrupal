import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import {
  fetchCommentById,
  createComment,
  updateComment,
  clearSelectedComment,
} from "../features/comments/commentSlice";

import { fetchPosts } from "../features/posts/postSlice";

import { Comment } from "../models/Comment";

function CommentForm() {
  const { id, postId } = useParams<{
    id: string;
    postId: string;
  }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    selectedComment,
    loading,
    error,
  } = useAppSelector((state) => state.comments);

  const { posts } = useAppSelector((state) => state.posts);

  const isEditing = !!id;

  const currentPostId = Number(postId || 0);

  const [comment, setComment] = useState<Omit<Comment, "id">>({
    postId: currentPostId,
    name: "",
    email: "",
    body: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchCommentById(Number(id)));
    }

    return () => {
      dispatch(clearSelectedComment());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (selectedComment && isEditing) {
      setComment({
        postId: selectedComment.postId,
        name: selectedComment.name,
        email: selectedComment.email,
        body: selectedComment.body,
      });
    }
  }, [selectedComment, isEditing]);

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: "error",
      });
    }
  }, [error]);

  const handleSave = async () => {
    try {
      if (comment.postId <= 0) {
        setSnackbar({
          open: true,
          message: "Seleccione un Post.",
          severity: "error",
        });
        return;
      }

      if (!comment.name.trim()) {
        setSnackbar({
          open: true,
          message: "Debe ingresar el nombre.",
          severity: "error",
        });
        return;
      }

      if (!comment.email.trim()) {
        setSnackbar({
          open: true,
          message: "Debe ingresar el email.",
          severity: "error",
        });
        return;
      }

      if (!comment.body.trim()) {
        setSnackbar({
          open: true,
          message: "Debe ingresar el comentario.",
          severity: "error",
        });
        return;
      }

      if (isEditing && id) {
        await dispatch(
            updateComment({
              id: Number(id),
              comment,
            })
        ).unwrap();

        setSnackbar({
          open: true,
          message: "Comentario actualizado correctamente.",
          severity: "success",
        });
      } else {
        await dispatch(createComment(comment)).unwrap();

        setSnackbar({
          open: true,
          message: "Comentario creado correctamente.",
          severity: "success",
        });
      }

      setTimeout(() => {
        navigate(`/posts/${comment.postId}/comments`);
      }, 1200);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Ocurrió un error al guardar el comentario.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
        <Box
            sx={{
              mt: 5,
              textAlign: "center",
            }}
        >
          <Typography>Cargando...</Typography>
        </Box>
    );
  }
  return (
      <Box
          sx={{
            maxWidth: 600,
            margin: "40px auto",
            px: 2,
          }}
      >
        <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
            }}
        >
          <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
          >
            <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                }}
            >
              {isEditing
                  ? "Editar Comentario"
                  : "Crear Nuevo Comentario"}
            </Typography>

            {/* Selección del Post */}
            <FormControl fullWidth>
              <InputLabel>Post</InputLabel>

              <Select
                  value={comment.postId}
                  label="Post"
                  onChange={(e) =>
                      setComment({
                        ...comment,
                        postId: Number(e.target.value),
                      })
                  }
              >
                <MenuItem value={0}>
                  <em>Seleccione un Post</em>
                </MenuItem>

                {posts.map((post) => (
                    <MenuItem
                        key={post.id}
                        value={post.id}
                    >
                      {post.id} - {post.title}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
                label="Nombre"
                fullWidth
                value={comment.name}
                onChange={(e) =>
                    setComment({
                      ...comment,
                      name: e.target.value,
                    })
                }
            />

            <TextField
                label="Email"
                type="email"
                fullWidth
                value={comment.email}
                onChange={(e) =>
                    setComment({
                      ...comment,
                      email: e.target.value,
                    })
                }
            />

            <TextField
                label="Comentario"
                multiline
                rows={4}
                fullWidth
                value={comment.body}
                onChange={(e) =>
                    setComment({
                      ...comment,
                      body: e.target.value,
                    })
                }
            />
          </CardContent>

          <CardActions
              sx={{
                justifyContent: "flex-start",
                px: 3,
                pb: 3,
                gap: 2,
              }}
          >
            <Button
                variant="outlined"
                component={Link}
                to={
                  comment.postId > 0
                      ? `/posts/${comment.postId}/comments`
                      : "/comments"
                }
            >
              Cancelar
            </Button>

            <Button
                variant="contained"
                onClick={handleSave}
            >
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </CardActions>
        </Card>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() =>
                setSnackbar({
                  ...snackbar,
                  open: false,
                })
            }
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
        >
          <Alert
              severity={snackbar.severity}
              onClose={() =>
                  setSnackbar({
                    ...snackbar,
                    open: false,
                  })
              }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
  );
}

export default CommentForm;
