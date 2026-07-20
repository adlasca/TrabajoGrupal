package org.web;

import io.helidon.config.Config;
import io.helidon.dbclient.DbClient;
import io.helidon.webserver.WebServer;
import org.web.respositories.AlbumRepository;
import org.web.respositories.UserRepository;
import org.web.services.AlbumService;
import org.web.services.DbService;
import org.web.services.UserService;
import org.web.services.impl.AlbumImpl;
import org.web.services.impl.UserImpl;
import org.web.utils.GlobalException;


public class Main {
    public static void main(String[] args) {

        Config config = Config.create();

        DbClient dbClient = DbClient.create(config.get("db"));

        DbService dbService = new DbService(dbClient);
        //Creacion DB
        dbService.createDb();

        UserRepository userRepository = new UserRepository(dbService.dbClient());
        AlbumRepository albumRepository = new AlbumRepository(dbService.dbClient());

        UserService userService = new UserService(userRepository);
        AlbumService albumService = new AlbumService(albumRepository,userRepository);


        UserImpl userImpl = new UserImpl(userService);
        AlbumImpl albumImpl = new AlbumImpl(albumService);


        WebServer server = WebServer.builder()
                        .config(config.get("server"))
                                .routing(routing->{
                                    GlobalException.register(routing);
                                    routing.register("/users",userImpl);
                                    routing.register("/albums",albumImpl);
                                })
                                        .build()
                                                .start();

        System.out.println("WEB server is up! http://localhost:" + server.port());

    }


}