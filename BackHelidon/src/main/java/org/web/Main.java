package org.web;

import io.helidon.config.Config;
import io.helidon.dbclient.DbClient;
import io.helidon.webserver.WebServer;
import org.web.respositories.AlbumRepository;
import org.web.respositories.TodoRepository;
import org.web.respositories.UserRepository;
import org.web.services.AlbumService;
import org.web.services.DbService;
import org.web.services.TodoService;
import org.web.services.UserService;
import org.web.services.impl.AlbumImpl;
import org.web.services.impl.TodoImpl;
import org.web.services.impl.UserImpl;
import org.web.utils.GlobalException;


public class Main {
    public static void main(String[] args) {

        Config config = Config.create();

        DbClient dbClient = DbClient.create(config.get("db"));

        DbService dbService = new DbService(dbClient);
        //Creacion DB
        dbService.createDb();

        //Repositorios
        UserRepository userRepository = new UserRepository(dbService.dbClient());
        AlbumRepository albumRepository = new AlbumRepository(dbService.dbClient());
        TodoRepository todoRepository = new TodoRepository(dbService.dbClient());

        //Servicios
        UserService userService = new UserService(userRepository);
        AlbumService albumService = new AlbumService(albumRepository,userRepository);
        TodoService todoService = new TodoService(todoRepository,userRepository);

        //Implementacioness
        UserImpl userImpl = new UserImpl(userService);
        AlbumImpl albumImpl = new AlbumImpl(albumService);
        TodoImpl todoImpl = new TodoImpl(todoService);


        WebServer server = WebServer.builder()
                        .config(config.get("server"))
                                .routing(routing->{
                                    GlobalException.register(routing);
                                    routing.register("/users",userImpl);
                                    routing.register("/albums",albumImpl);
                                    routing.register("/todos",todoImpl);
                                })
                                        .build()
                                                .start();

        System.out.println("WEB server is up! http://localhost:" + server.port());

    }


}