package org.web.respositories;

import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import org.web.db.Post;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class PostRepository {
    private final DbClient dbClient;

    public PostRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    private Post mapRow(DbRow row)  {
        return Post.builder()
                .id(row.column("id").as(Integer.class).get())
                .userId(row.column("user_id").as(Integer.class).get())
                .title(row.column("title").as(String.class).orElse(null))
                .body(row.column("body").as(String.class).orElse(null))
                .build();
    }

    public List<Post> findAll(){
        return dbClient.execute()
                .createNamedQuery("select-posts")
                .execute()
                .map(this::mapRow)
                .toList();
    }

    public Optional<Post> findById(Integer id){
        return dbClient.execute()
                .createNamedGet("select-postId")
                .addParam("id",id)
                .execute()
                .map(this::mapRow);
    }

    public Post create(Post post){
        Integer generateId = dbClient.execute()
                .createNamedQuery("insert-post")
                .addParam("user_id",post.userId())
                .addParam("title",post.title())
                .addParam("body",post.body())
                .execute()
                .map(row->row.column("id").as(Integer.class).get())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Error al insertar el usuario"));

        return Post.builder()
                .id(generateId)
                .userId(post.userId())
                .title(post.title())
                .body(post.body())
                .build();
    }

    public long update(Integer id, Post post){
        return dbClient.execute()
                .createNamedUpdate("update-post")
                .addParam("id",id)
                .addParam("user_id",post.userId())
                .addParam("title",post.title())
                .addParam("body", post.body())
                .execute();
    }

    public long delete(Integer id){
        return dbClient.execute()
                .createNamedDelete("delete-post")
                .addParam("id",id)
                .execute();
    }

}
