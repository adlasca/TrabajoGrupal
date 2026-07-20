package org.web.respositories;

import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import org.web.db.Comment;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class CommentRepository {
    private final DbClient dbClient;

    public CommentRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    private Comment mapRow(DbRow row)  {
        return Comment.builder()
                .id(row.column("id").as(Integer.class).get())
                .postId(row.column("post_id").as(Integer.class).get())
                .email(row.column("email").as(String.class).orElse(null))
                .name(row.column("name").as(String.class).orElse(null))
                .body(row.column("body").as(String.class).orElse(null))
                .build();
    }

    public List<Comment> findAll(){
        return  dbClient.execute()
                .createNamedQuery("select-comments")
                .execute()
                .map(this::mapRow)
                .toList();
    }

    public Optional<Comment> findById(Integer id){
        return dbClient.execute()
                .createNamedGet("select-commentId")
                .addParam("id", id)
                .execute()
                .map(this::mapRow);
    }

    public Comment create(Comment comment){
        Integer generatedId = dbClient.execute()
                .createNamedQuery("insert-comment")
                .addParam("post_id", comment.postId())
                .addParam("email", comment.email())
                .addParam("name", comment.name())
                .addParam("body", comment.body())
                .execute()
                .map(row -> row.column("id").as(Integer.class).get())
                .findFirst()
                .orElseThrow(()->new RuntimeException("Error al insertar comentario"));

        return Comment.builder()
                .id(generatedId)
                .postId(comment.postId())
                .email(comment.email())
                .name(comment.name())
                .body(comment.body())
                .build();
    }

    public long update( Integer id,Comment comment){
        return dbClient.execute()
                .createNamedUpdate("update-comment")
                .addParam("id", id)
                .addParam("post_id", comment.postId())
                .addParam("email", comment.email())
                .addParam("name", comment.name())
                .addParam("body", comment.body())
                .execute();
    }

    public long deleteById(Integer id){
        return dbClient.execute()
                .createNamedDelete("delete-comment")
                .addParam("id", id)
                .execute();
    }


}
