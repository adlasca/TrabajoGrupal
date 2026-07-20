package org.web.services.impl;

import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import org.web.db.Album;
import org.web.services.AlbumService;

import java.util.Map;

public class AlbumImpl implements HttpService {
    private final AlbumService albumService;
    public AlbumImpl(AlbumService albumService) {
        this.albumService = albumService;
    }


    @Override
    public void routing(HttpRules rules) {
        rules.get("/", this::findAll)
                .get("/{id}", this::findById)
                .post("/",this::create)
                .put("/{id}",this::update)
                .delete("/{id}",this::delete);

    }

    private void findAll(ServerRequest req, ServerResponse res) {

        res.header("Content-Type", "application/json")
                .send(albumService.findAll());
    }

    private void findById(ServerRequest req, ServerResponse res) {
        Integer id= Integer.parseInt(req.path().pathParameters().get("id"));

        albumService.findById(id).ifPresentOrElse(res::send,()->{
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("error", "Album Not Found"));
        });
    }

    private void create(ServerRequest req, ServerResponse res) {
        Album album = req.content().as(Album.class);

        Album saved = albumService.create(album);

        res.status(Status.CREATED_201).send(saved);

    }

    private void update(ServerRequest req, ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));
        Album album = req.content().as(Album.class);

        boolean updated = albumService.update(id, album);

        if(updated){
            res.status(Status.NO_CONTENT_204)
                    .send();
        }else{
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("error", "Album Not Found"));
        }
    }

    private void delete(ServerRequest req, ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));
        boolean deleted = albumService.delete(id);
        if(deleted){
            res.status(Status.NO_CONTENT_204).send();
        }else{
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("error", "Album Not Found"));
        }
    }

}
