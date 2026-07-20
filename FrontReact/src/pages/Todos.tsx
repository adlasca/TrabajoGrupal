import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Checkbox
} from "@mui/material";
import { Link } from 'react-router-dom';
import {
    useAppDispatch,
    useAppSelector
} from "../hooks/redux";

import {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo
} from "../features/todos/todoSlice";

import type { Todo } from "../models/Todo";

function Todos() {

    const dispatch = useAppDispatch();

    const { todos, loading } = useAppSelector(
        state => state.todos
    );

    const [title, setTitle] = useState("");
    const [userId, setUserId] = useState(1);

    // Nuevo estado para editar
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);

    // Crear o actualizar
    const guardar = () => {

        const todo: Omit<Todo, "id"> = {
            userId,
            title,
            completed
        };

        if (editandoId === null) {

            dispatch(createTodo(todo));

        } else {

            dispatch(updateTodo({
                id: editandoId,
                todo
            }));

            setEditandoId(null);
        }

        setTitle("");
        setUserId(1);
        setCompleted(false);
    };

    // Llenar formulario
    const editar = (todo: Todo) => {

        setEditandoId(todo.id!);
        setTitle(todo.title);
        setUserId(todo.userId);
        setCompleted(todo.completed);

    };

    // Cambiar estado desde el checkbox
    const cambiarEstado = (todo: Todo) => {

        dispatch(updateTodo({
            id: todo.id!,
            todo: {
                userId: todo.userId,
                title: todo.title,
                completed: !todo.completed
            }
        }));

    };

    const eliminar = (id: number) => {

        dispatch(deleteTodo(id));

        if (editandoId === id) {
            setEditandoId(null);
            setTitle("");
            setUserId(1);
            setCompleted(false);
        }

    };

    if (loading) {

        return (
            <Typography align="center">
                Cargando...
            </Typography>
        );

    }

    return (

        <Container sx={{ mt: 5 }}>

            <Typography
                variant="h3"
                align="center"
            >
                Tareas
            </Typography>
            <Button
                variant="outlined"
                color="warning"
                component={Link}
                to="/"
                sx={{mb:2, mr:2}}

            >

                Regresar

            </Button>


            <Paper sx={{ p: 3, mt: 3 }}>

                <TextField
                    label="Usuario"
                    type="number"
                    value={userId}
                    onChange={(e) =>
                        setUserId(Number(e.target.value))
                    }
                />

                <TextField
                    label="Título"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    sx={{ ml: 2 }}
                />

                <Button
                    variant="contained"
                    onClick={guardar}
                    sx={{ ml: 2 }}
                >
                    {editandoId === null ? "Crear" : "Actualizar"}
                </Button>

            </Paper>

            <TableContainer
                component={Paper}
                sx={{ mt: 4 }}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>ID</TableCell>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Título</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {todos.map((todo) => (

                            <TableRow key={todo.id}>

                                <TableCell>{todo.id}</TableCell>

                                <TableCell>{todo.userId}</TableCell>

                                <TableCell>{todo.title}</TableCell>

                                <TableCell>

                                    <Checkbox
                                        checked={todo.completed}
                                        onChange={() => cambiarEstado(todo)}
                                    />

                                    {todo.completed
                                        ? "Completada"
                                        : "Pendiente"}

                                </TableCell>

                                <TableCell>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => editar(todo)}
                                        sx={{ mr: 1 }}
                                    >
                                        Editar
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => eliminar(todo.id!)}
                                    >
                                        Eliminar
                                    </Button>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

        </Container>

    );

}

export default Todos;