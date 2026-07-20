import NavBar from './components/NavBar';

import {Route, Routes} from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';

import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';

import Comments from './pages/Comments';
import CommentForm from './pages/CommentForm';

import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import UserPosts from './pages/UserPosts';
import UserAlbums from './pages/UserAlbums';

import Albums from './pages/Albums';
import Photos from './pages/Photos';

import Todos from "./pages/Todos";


function App() {


    return (

        <>

            <NavBar/>


            <Routes>


                <Route
                    path="/"
                    element={<Home/>}
                />


                <Route
                    path="/about"
                    element={<About/>}
                />


                {/* POSTS */}

                <Route
                    path="/posts"
                    element={<Posts/>}
                />


                <Route
                    path="/posts/:id"
                    element={<PostDetail/>}
                />


                {/* COMENTARIOS DE UN POST */}

                <Route
                    path="/posts/:id/comments"
                    element={<Comments/>}
                />


                {/* CREAR COMENTARIO DESDE UN POST */}

                <Route
                    path="/posts/:postId/comments/new"
                    element={<CommentForm/>}
                />


                {/* EDITAR COMENTARIO */}

                <Route
                    path="/posts/:postId/comments/:id"
                    element={<CommentForm/>}
                />


                {/* TODOS LOS COMENTARIOS */}

                <Route
                    path="/comments"
                    element={<Comments/>}
                />


                {/* CREAR COMENTARIO GENERAL */}

                <Route
                    path="/comments/new"
                    element={<CommentForm/>}
                />


                {/* PHOTOS */}

                <Route
                    path="/photos"
                    element={<Photos/>}
                />


                {/* TODOS */}

                <Route
                    path="/todos"
                    element={<Todos/>}
                />


                {/* USERS */}

                <Route
                    path="/users"
                    element={<Users/>}
                />


                <Route
                    path="/users/:id"
                    element={<UserDetail/>}
                />


                <Route
                    path="/users/:id/posts"
                    element={<UserPosts/>}
                />


                <Route
                    path="/users/:id/albums"
                    element={<UserAlbums/>}
                />


                {/* ALBUMS */}

                <Route
                    path="/albums"
                    element={<Albums/>}
                />


                <Route
                    path="/albums/:id/photos"
                    element={<Photos/>}
                />


            </Routes>


        </>

    );

}


export default App;