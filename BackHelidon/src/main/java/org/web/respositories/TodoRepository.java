package org.web.respositories;

import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import org.web.db.Todo;

import java.util.List;
import java.util.Optional;

public class TodoRepository {

    private final DbClient dbClient;

    public TodoRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    private Todo mapRow(DbRow row) {
        return Todo.builder()
                .id(row.column("id").as(Integer.class).get())
                .userId(row.column("user_id").as(Integer.class).get())
                .title(row.column("title").as(String.class).orElse(null))
                .completed(row.column("completed").as(Boolean.class).orElse(false))
        .build();
    }

    public List<Todo> findAll(){
        return dbClient.execute()
                .createNamedQuery("select-todos")
                .execute()
                .map(this::mapRow)
                .toList();
    }

    public Optional<Todo> findById(Integer id){
        return dbClient.execute()
                .createNamedGet("select-todoId")
                .addParam("id", id)
                .execute()
                .map(this::mapRow);
    }

    public Todo create(Todo todo){
        Integer generatedId = dbClient.execute()
                .createNamedQuery("insert-todo")
                .addParam("user_id",todo.userId())
                .addParam("title",todo.title())
                .addParam("completed",todo.completed())
                .execute()
                .map(row->row.column("id").as(Integer.class).get())
                .findFirst()
                .orElseThrow(()-> new RuntimeException("Error al insertar"));

        return Todo.builder()
                .id(generatedId)
                .userId(todo.userId())
                .title(todo.title())
                .completed(todo.completed())
                .build();
    }

    public long deleteById(Integer id){
        return dbClient.execute()
                .createNamedDelete("delete-todo")
                .addParam("id", id)
                .execute();
    }

    public long update(Integer id, Todo todo){
        return dbClient.execute()
                .createNamedUpdate("update-todo")
                .addParam("id", todo.id())
                .addParam("user_id",todo.userId())
                .addParam("title",todo.title())
                .addParam("completed", todo.completed())
                .execute();
    }

}
