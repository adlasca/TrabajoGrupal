import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Comments from './pages/Comments';
import CommentForm from './pages/CommentForm';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import UserPosts from './pages/UserPosts';
import UserTodos from './pages/UserTodos';
import UserAlbums from './pages/UserAlbums';
import Albums from './pages/Albums';
import Photos from './pages/Photos';

function App() {
  return (
      <>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />


          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/:id/comments" element={<Comments />} />
          <Route path="/posts/:id/comments/new" element={<CommentForm />} />
          <Route path="/comments/:id" element={<CommentForm />} />


          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/users/:id/posts" element={<UserPosts />} />
          <Route path="/users/:id/todos" element={<UserTodos />} />
          <Route path="/users/:id/albums" element={<UserAlbums />} />


          <Route path="/albums" element={<Albums />} />
          <Route path="/albums/:id/photos" element={<Photos />} />
        </Routes>
      </>
  );
}

export default App;