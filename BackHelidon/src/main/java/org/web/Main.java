package org.web;

import io.helidon.config.Config;
import io.helidon.dbclient.DbClient;
import io.helidon.webserver.WebServer;
import io.helidon.webserver.cors.CorsFeature;
import org.web.respositories.*;
import org.web.services.*;
import org.web.services.impl.*;
import org.web.utils.GlobalException;


public class Main {
    public static void main(String[] args) {

        Config config = Config.create();
        CorsFeature corsFeature = CorsFeature.create(config.get("cors"));

        DbClient dbClient = DbClient.create(config.get("db"));

        DbService dbService = new DbService(dbClient);
        //Creacion DB
        dbService.createDb();

        //Repositorios
        UserRepository userRepository = new UserRepository(dbService.dbClient());
        AlbumRepository albumRepository = new AlbumRepository(dbService.dbClient());
        TodoRepository todoRepository = new TodoRepository(dbService.dbClient());
        PostRepository postRepository = new PostRepository(dbService.dbClient());
        CommentRepository commentRepository = new CommentRepository(dbService.dbClient());
        PhotoRepository photoRepository = new PhotoRepository(dbService.dbClient());


        //Servicios
        UserService userService = new UserService(userRepository);
        AlbumService albumService = new AlbumService(albumRepository,userRepository);
        TodoService todoService = new TodoService(todoRepository,userRepository);
        PostService postService = new PostService(postRepository,userRepository);
        CommentService commentService = new CommentService(commentRepository,postRepository);
        PhotoService photoService = new PhotoService(photoRepository,albumRepository);

        //Implementacioness
        UserImpl userImpl = new UserImpl(userService);
        AlbumImpl albumImpl = new AlbumImpl(albumService);
        TodoImpl todoImpl = new TodoImpl(todoService);
        PostImpl postImpl = new PostImpl(postService);
        CommentImpl commentImpl = new CommentImpl(commentService);
        PhotoImpl photoImpl = new PhotoImpl(photoService);


        WebServer server = WebServer.builder()
                        .config(config.get("server"))
                .addFeature(corsFeature)
                                .routing(routing->{
                                    GlobalException.register(routing);
                                    routing.register("/users",userImpl);
                                    routing.register("/albums",albumImpl);
                                    routing.register("/todos",todoImpl);
                                    routing.register("/comments",commentImpl);
                                    routing.register("/posts",postImpl);
                                    routing.register("/photos",photoImpl);
                                })
                                        .build()
                                                .start();

        System.out.println("WEB server is up! http://localhost:" + server.port());

    }


}