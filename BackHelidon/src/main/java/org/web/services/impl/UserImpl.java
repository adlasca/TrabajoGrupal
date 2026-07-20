package org.web.services.impl;

import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import org.web.db.User;
import org.web.services.UserService;

import java.util.Map;

public class UserImpl implements HttpService {

    private final UserService userService;

    public UserImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void routing(HttpRules rules) {
        rules.get("/",this::findAll)
                .get("/{id}",this::findById)
                .post("/",this::create)
                .put("/{id}",this::update)
                .delete("/{id}",this::delete);
    }

    private void findAll(ServerRequest req , ServerResponse  res) {
        res
                .header("Content-Type", "application/json")
                .send(userService.findAll());
    }
    private void findById(ServerRequest req , ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));

        userService.findById(id)
                .ifPresentOrElse(
                        user -> res.send(user),
                        ()-> res.status(Status.NOT_FOUND_404)
                                .send(Map.of("error: ","no encontrado")));
    }

    private void create(ServerRequest req , ServerResponse res) {
        User user = req.content().as(User.class);
        User saved = userService.create(user);

        res.status(Status.CREATED_201).send(saved);
    }

    private  void update(ServerRequest req , ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));
        User datosActualizar = req.content().as(User.class);

        boolean actualizado = userService.update(id, datosActualizar);
        if(actualizado) {
            res.status(Status.NO_CONTENT_204).send();
        }else {
            res.status(Status.NOT_FOUND_404).send();
        }
    }

    private void delete(ServerRequest req , ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));

        boolean eliminado =userService.delete(id);
        if(eliminado) {
            res.status(Status.NO_CONTENT_204).send();
        }else{
            res.status(Status.NOT_FOUND_404).send();
        }

    }

}
