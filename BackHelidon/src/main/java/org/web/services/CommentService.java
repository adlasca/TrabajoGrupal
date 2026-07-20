package org.web.services;

import org.web.db.Comment;
import org.web.respositories.CommentRepository;
import org.web.respositories.PostRepository;
import org.web.utils.ExceptionHandler;

import java.util.List;
import java.util.Optional;

public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    public Optional<Comment> findById(Integer id) {
        return commentRepository.findById(id);
    }

    public Comment create(Comment comment) {
        if(comment.postId() ==null || postRepository.findById(comment.id()).isEmpty()) {
            throw new ExceptionHandler("Post not found");
        }
        return commentRepository.create(comment);
    }
    public boolean update(Integer id,Comment comment) {
        if(commentRepository.findById(comment.id()).isEmpty()) {
            return false;
        }
        if(comment.postId() ==null || postRepository.findById(comment.id()).isEmpty()) {
            throw new ExceptionHandler("Post not found");
        }
        return commentRepository.update(id,comment)>0;
    }

    public boolean delete(Integer id) {
        return commentRepository.deleteById(id) > 0;
    }

}
