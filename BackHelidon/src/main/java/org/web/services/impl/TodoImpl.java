package org.web.services.impl;

import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import org.web.db.Todo;
import org.web.services.TodoService;

import java.util.Map;

public class TodoImpl implements HttpService {

    private final TodoService todoService;

    public TodoImpl(TodoService todoService) {
        this.todoService = todoService;
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
        res
                .header("Content-Type", "application/json")
                .send(todoService.findAll());
    }

    private void findById(ServerRequest req, ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));

        todoService.findById(id)
                .ifPresentOrElse(
                        res::send,
                        ()->res.status(Status.NOT_FOUND_404)
                                .send(Map.of("error: ", "El usuario no encontrado"))
                );
    }

    private void create(ServerRequest req, ServerResponse res) {
        Todo todo = req.content().as(Todo.class);
        Todo saved = todoService.create(todo);

        res.status(Status.CREATED_201).send(saved);
    }

    private void update(ServerRequest req, ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));

        Todo datosActualizar = req.content().as(Todo.class);

        boolean actualizado = todoService.update(id, datosActualizar);
        if (actualizado) {
            res.status(Status.NO_CONTENT_204).send();
        }else{
            res.status(Status.NOT_FOUND_404).send();
        }

    }

    private void delete(ServerRequest req, ServerResponse res) {
        Integer id = Integer.parseInt(req.path().pathParameters().get("id"));

        boolean deleted = todoService.delete(id);
        if (deleted) {
            res.status(Status.NO_CONTENT_204).send();
        }else{
            res.status(Status.NOT_FOUND_404).send();
        }
    }

}
