package org.web.services.impl;

import io.helidon.http.Http;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import org.web.db.Photo;
import org.web.services.PhotoService;

import java.util.Map;

public class PhotoImpl implements HttpService {

    private final PhotoService photoService;

    public PhotoImpl(PhotoService photoService) {
        this.photoService = photoService;
    }

    @Override
    public void routing(HttpRules rules) {
        rules.get("/",this::findAll)
                .get("/{id}",this::findById)
                .post("/",this::create)
                .put("/{id}",this::update)
                .delete("/{id}",this::delete);
    }

    private void findAll(ServerRequest req, ServerResponse res){
        res.send(photoService.findAll());
    }

    private void findById(ServerRequest req, ServerResponse res){

        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));

        photoService.findById(id).ifPresentOrElse(res::send, ()->{
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("message", "Photo not found"));
        });
    }

    private void create(ServerRequest req, ServerResponse res){
        Photo photo = req.content().as(Photo.class);

        Photo saved = photoService.create(photo);

        res.status(Status.CREATED_201).send(saved);
    }

    private void update(ServerRequest req, ServerResponse res){
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));
        Photo photo = req.content().as(Photo.class);

        boolean updated = photoService.update(id, photo);

        if(updated){
            res.status(Status.NO_CONTENT_204)
                    .send();
        }else{
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("error: ", "Photo not found"));
        }

    }

    private void delete(ServerRequest req, ServerResponse res){
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));
        boolean deleted = photoService.delete(id);
        if(deleted){
            res.status(Status.NO_CONTENT_204).send();
        }else {
            res.status(Status.NOT_FOUND_404)
                    .send(Map.of("error: ", "Photo not found"));
        }
    }

}
