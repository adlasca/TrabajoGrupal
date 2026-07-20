package org.web.respositories;

import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import org.web.db.Photo;

import java.util.List;
import java.util.Optional;

public class PhotoRepository {
    private final DbClient dbClient;

    public PhotoRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    private Photo mapRow(DbRow row){
        return  Photo.builder()
                .id(row.column("id").as(Integer.class).get())
                .title(row.column("title").as(String.class).orElse(null))
                .url(row.column("url").as(String.class).orElse(null))
                .thumbnailUrl(row.column("thumbnail_url").as(String.class).orElse(null))
                .albumId(row.column("album_id").as(Integer.class).get())
                .build();
    }

    public List<Photo> findAll(){
        return dbClient.execute()
                .createNamedGet("select-photos")
                .execute()
                .map(this::mapRow)
                .stream().toList();
    }

    public Optional<Photo> findById(Integer id){
        return dbClient.execute()
                .createNamedGet("select-photoId")
                .execute()
                .map(this::mapRow);
    }

    public Photo create(Photo photo){
        Integer generatedId = dbClient.execute()
                .createNamedQuery("insert-photo")
                .addParam("album_id",photo.albumId())
                .addParam("thumbnail_url",photo.thumbnailUrl())
                .addParam("url", photo.url())
                .addParam("title", photo.title())
                .execute()
                .map(row-> row.column("id").as(Integer.class).get())
                .findFirst()
                .orElseThrow(()->new RuntimeException("Error al crear foto"));

        return Photo.builder()
                .id(generatedId)
                .title(photo.title())
                .url(photo.url())
                .thumbnailUrl(photo.thumbnailUrl())
                .albumId(photo.albumId())
                .build();

    }


    public long update(Integer id, Photo photo){
        return dbClient.execute()
                .createNamedUpdate("update-photo")
                .addParam("id",photo.id())
                .addParam("album_id",photo.albumId())
                .addParam("thumbnail_url",photo.thumbnailUrl())
                .addParam("url",photo.url())
                .addParam("title",photo.title())
                .execute();
    }

    public long delete(Integer id){
        return dbClient.execute()
                .createNamedDelete("delete-photo")
                .addParam("id",id)
                .execute();
    }

}
