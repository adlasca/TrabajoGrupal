import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  TextField,
  CardActions,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchTodosByUserId, createTodo, updateTodo, deleteTodo } from '../features/todos/todoSlice';
import type { Todo } from '../models/Todo';

function UserTodos() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { todos, loading, error } = useAppSelector((state) => state.todos);
  
  const [newTodo, setNewTodo] = useState<Omit<Todo, 'id'>>({
    userId: Number(id),
    title: '',
    completed: false,
  });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchTodosByUserId(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const handleCreateTodo = async () => {
    if (!newTodo.title.trim()) {
      setSnackbar({ open: true, message: 'El título es requerido', severity: 'error' });
      return;
    }
    try {
      await dispatch(createTodo(newTodo)).unwrap();
      setSnackbar({ open: true, message: 'Tarea creada', severity: 'success' });
      setNewTodo({ userId: Number(id), title: '', completed: false });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al crear tarea', severity: 'error' });
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    if (!todo) return;
    try {
      const { id: todoId, ...todoData } = todo;
      await dispatch(updateTodo({ id: todoId!, todo: todoData })).unwrap();
      setSnackbar({ open: true, message: 'Tarea actualizada', severity: 'success' });
      setEditingTodo(null);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al actualizar tarea', severity: 'error' });
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await dispatch(deleteTodo(todoId)).unwrap();
        setSnackbar({ open: true, message: 'Tarea eliminada', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al eliminar tarea', severity: 'error' });
      }
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    try {
      const { id: todoId, ...todoData } = updatedTodo;
      await dispatch(updateTodo({ id: todoId!, todo: todoData })).unwrap();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al actualizar estado', severity: 'error' });
    }
  };

  const handleEditChange = (field: keyof Todo, value: string | boolean) => {
    if (editingTodo) {
      setEditingTodo({ ...editingTodo, [field]: value });
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography>Cargando tareas...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 5, textAlign: "center" }}>
        Tareas del Usuario #{id}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 800, margin: "20px auto", px: 2 }}>
        {/* Formulario para crear nueva tarea */}
        <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: "#fafafa", borderStyle: "dashed", borderWidth: 2 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
              Crear Nueva Tarea
            </Typography>
            <TextField
              label="Título de la tarea"
              variant="outlined"
              fullWidth
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newTodo.completed}
                  onChange={(e) => setNewTodo({ ...newTodo, completed: e.target.checked })}
                />
              }
              label="Completada"
            />
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2 }}>
            <Button variant="contained" color="success" onClick={handleCreateTodo}>
              Agregar Tarea
            </Button>
          </CardActions>
        </Card>

        {/* Lista de tareas */}
        {todos.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary">
            No hay tareas para este usuario
          </Typography>
        ) : (
          todos.map((todo: Todo) => (
            <Card key={todo.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {editingTodo && editingTodo.id === todo.id ? (
                  // Modo edición
                  <>
                    <TextField
                      label="Título"
                      variant="outlined"
                      fullWidth
                      value={editingTodo.title}
                      onChange={(e) => handleEditChange('title', e.target.value)}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editingTodo.completed}
                          onChange={(e) => handleEditChange('completed', e.target.checked)}
                        />
                      }
                      label="Completada"
                    />
                  </>
                ) : (
                  // Modo vista
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Checkbox
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo)}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          textDecoration: todo.completed ? "line-through" : "none",
                          color: todo.completed ? "text.secondary" : "text.primary",
                        }}
                      >
                        {todo.title}
                      </Typography>
                      <Typography variant="caption" sx={{ ml: 'auto' }}>
                        ID: {todo.id}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
                {editingTodo && editingTodo.id === todo.id ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateTodo(editingTodo)}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setEditingTodo(null)}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setEditingTodo(todo)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteTodo(todo.id!)}
                    >
                      Eliminar
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          ))
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
        <Button variant="contained" color="secondary" component={Link} to="/users" size="large">
          Regresar a Usuarios
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default UserTodos;