package org.web.respositories;

import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import org.web.db.Comment;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

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
                .createNamedGet("select-comments")
                .execute()
                .map(this::mapRow)
                .stream().toList();
    }
}
