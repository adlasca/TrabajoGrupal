package org.web.services.impl;

import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import org.web.db.Comment;
import org.web.services.CommentService;

import java.util.Map;

public class CommentImpl implements HttpService {

    private final CommentService commentService;

    public CommentImpl(CommentService commentService) {
        this.commentService = commentService;
    }

    @Override
    public void routing(HttpRules rules) {

    }

    private void findAll(ServerRequest req, ServerResponse res) {
        res.send(commentService.findAll());
    }

    private void findById(ServerRequest req, ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));

        commentService.findById(id).ifPresentOrElse(res::send,
                ()->{
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("error", "Comment Not Found"));
                });
    }

    private void create(ServerRequest req, ServerResponse res) {
        Comment comment = req.content().as(Comment.class);

        Comment saved = commentService.create(comment);
        res.status(Status.CREATED_201).send(saved);
    }

    private void update(ServerRequest req, ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));
        Comment comment = req.content().as(Comment.class);

        boolean updated = commentService.update(id, comment);

        if(updated) {
            res.status(Status.NO_CONTENT_204).send();
        }else{
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("error", "Comment Not Found"));
        }
    }

}
