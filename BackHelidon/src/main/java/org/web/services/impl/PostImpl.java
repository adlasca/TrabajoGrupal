package org.web.services.impl;

import io.helidon.http.Http;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import org.web.db.Post;
import org.web.services.PostService;

import java.util.Map;

public class PostImpl implements HttpService {

    private final PostService postService;

    public PostImpl(PostService postService) {
        this.postService = postService;
    }

    @Override
    public void routing(HttpRules rules) {

        rules.get("/",this::findAll)
                .get("/{id}",this::findById)
                .post("/",this::create)
                .put("/{id}",this::update)
                .delete("/{id}",this::delete);

    }

    private void findAll(ServerRequest req, ServerResponse res) {
        postService.findAll();
    }

    private void findById(ServerRequest req, ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));

        postService.findById(id).ifPresentOrElse(res::send, () -> {
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("message", "Post Not Found"));
        });
    }

    private void create(ServerRequest req, ServerResponse res) {
        Post post = req.content().as(Post.class);

        Post saved =  postService.create(post);
        res.status(Status.CREATED_201).send(saved);
    }

    private void update(ServerRequest req, ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));
        Post post = req.content().as(Post.class);

        boolean updated = postService.update(id, post);

        if(updated) {
            res.status(Status.NO_CONTENT_204).send();
        }else{
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("error: ", "Post Not Found")
            );
        }
    }

    private void delete(ServerRequest req, ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));

        boolean deleted = postService.delete(id);
        if(deleted) {
            res.status(Status.NO_CONTENT_204).send();
        }else {
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("error: ", "Post Not Found"));
        }
    }

}
