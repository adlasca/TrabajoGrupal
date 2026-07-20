package org.web.respositories;

import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import org.web.db.Album;

import java.util.List;
import java.util.Optional;

public class AlbumRepository {
    private final DbClient dbClient;

    public AlbumRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    private Album mapRow(DbRow row){
        return Album.builder()
                .id(row.column("id").as(Integer.class).get())
                .userId(row.column("user_id").as(Integer.class).get())
                .title(row.column("title").as(String.class).orElse(null))

                .build();
    }

    public List<Album> findAll(){
        return dbClient.execute()
                .createNamedQuery("select-albums")
                .execute()
                .map(this::mapRow)
                .toList();
    }

    public Optional<Album> findById(Integer id){
        return dbClient.execute()
                .createNamedGet("select-albumId")
                .addParam("id", id)
                .execute()
                .map(this::mapRow);
    }

    public Album create(Album album){
        Integer generatedId= dbClient.execute()
                .createNamedQuery("insert-album")
                .addParam("user_id",album.userId() )
                .addParam("title",album.title())
                .execute()
                .map(row -> row.column("id").as(Integer.class).get())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Error al insertar el usuario"));

        return Album.builder()
                .id(generatedId)
                .userId(album.userId())
                .title(album.title())
                .build();
    }

    public long deleteById(Integer id){
        return dbClient.execute()
                .createNamedDelete("delete-album")
                .addParam("id",id)
                .execute();
    }

    public long update(Integer id,Album album){
        return dbClient.execute()
                .createNamedUpdate("update-album")
                .addParam("id",id)
                .addParam("title",album.title())
                .addParam("user_id",album.userId())
                .execute();
    }

}
