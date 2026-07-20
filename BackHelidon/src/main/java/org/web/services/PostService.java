package org.web.services;

import org.web.db.Post;
import org.web.respositories.PostRepository;
import org.web.respositories.UserRepository;
import org.web.utils.ExceptionHandler;

import java.util.List;
import java.util.Optional;

public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<Post> findAll() {
        return postRepository.findAll();
    }

    public Optional<Post> findById(Integer id) {
        return postRepository.findById(id);
    }

    public Post create(Post post) {
        if(post.userId()==null|| userRepository.findById(post.userId()).isEmpty()) {
            throw new ExceptionHandler("User Not Found");
        }
        return postRepository.create(post);
    }

    public boolean update(Integer id,Post post) {
        if(postRepository.findById(id).isEmpty()) {
            return false;
        }
        if(post.userId()==null|| userRepository.findById(post.userId()).isEmpty()) {
            throw new ExceptionHandler("User Not Found");
        }
        return postRepository.update(id,post)>0;
    }

    public boolean delete(Integer id) {
        return postRepository.delete(id)>0;
    }

}
