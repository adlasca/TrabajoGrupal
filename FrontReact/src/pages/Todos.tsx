import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Container,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from "@mui/icons-material/Article";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import CommentIcon from "@mui/icons-material/Comment";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ChecklistIcon from "@mui/icons-material/Checklist";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import { fetchUsers } from "../features/users/userSlice";
import { fetchPosts } from "../features/posts/postSlice";
import { fetchAlbums } from "../features/albums/albumSlice";
import { fetchComments } from "../features/comments/commentSlice";
import { fetchPhotos } from "../features/photos/photoSlice";
import { fetchTodos } from "../features/todos/todoSlice";

function Todos() {
    const dispatch = useAppDispatch();

    const { users } = useAppSelector((state) => state.users);
    const { posts } = useAppSelector((state) => state.posts);
    const { albums } = useAppSelector((state) => state.albums);
    const { comments } = useAppSelector((state) => state.comments);
    const { photos } = useAppSelector((state) => state.photos);
    const { todos } = useAppSelector((state) => state.todos);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchPosts());
        dispatch(fetchAlbums());
        dispatch(fetchComments());
        dispatch(fetchPhotos());
        dispatch(fetchTodos());
    }, [dispatch]);

    return (
        <Container sx={{ mt: 5 }}>
            <Typography
                variant="h4"
                gutterBottom sx={{ mt: 5, textAlign: "center" }}>
                Dashboard General
            </Typography>

            <Typography
                align="center"
                color="text.secondary"
                sx={{ mb: 5 }}
            >
                Resumen de toda la información del sistema
            </Typography>

            <Grid container spacing={3}>

                <Grid size={{xs:12, md:4}}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <PeopleIcon color="primary" sx={{ fontSize: 60 }} />
                            <Typography variant="h5">Usuarios</Typography>
                            <Typography variant="h3">{users.length}</Typography>

                            <Button
                                component={Link}
                                to="/users"
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Ver Usuarios
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{xs: 12, md:4}}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <ArticleIcon color="warning" sx={{ fontSize: 60 }} />
                            <Typography variant="h5">Posts</Typography>
                            <Typography variant="h3">{posts.length}</Typography>

                            <Button
                                component={Link}
                                to="/posts"
                                variant="contained"
                                color="warning"
                                sx={{ mt: 2 }}
                            >
                                Ver Posts
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{xs:12, md:4}}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <PhotoAlbumIcon color="success" sx={{ fontSize: 60 }} />
                            <Typography variant="h5">Álbumes</Typography>
                            <Typography variant="h3">{albums.length}</Typography>

                            <Button
                                component={Link}
                                to="/albums"
                                variant="contained"
                                color="success"
                                sx={{ mt: 2 }}
                            >
                                Ver Álbumes
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{xs:12, md:4}}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <CommentIcon color="secondary" sx={{ fontSize: 60 }} />
                            <Typography variant="h5">Comentarios</Typography>
                            <Typography variant="h3">{comments.length}</Typography>

                            <Button
                                component={Link}
                                to="/comments"
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 2 }}
                            >
                                Ver Comentarios
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{xs:12, md:4}}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <InsertPhotoIcon color="info" sx={{ fontSize: 60 }} />
                            <Typography variant="h5">Fotos</Typography>
                            <Typography variant="h3">{photos.length}</Typography>

                            <Button
                                component={Link}
                                to="/photos"
                                variant="contained"
                                color="info"
                                sx={{ mt: 2 }}
                            >
                                Ver Fotos
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{xs:12, md:4}}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <ChecklistIcon color="error" sx={{ fontSize: 60 }} />
                            <Typography variant="h5">Tareas</Typography>
                            <Typography variant="h3">{todos.length}</Typography>

                            <Button
                                component={Link}
                                to="/todos"
                                variant="contained"
                                color="error"
                                sx={{ mt: 2 }}
                            >
                                Ver Tareas
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Container>
    );
}

export default Todos;