package org.web.services;

import io.helidon.dbclient.DbClient;

public record DbService(DbClient dbClient) {

    public DbService {
        System.out.println("Iniciando DB Service");
    }

    public void createDb() {
        System.out.println("Creando DB");
        dbClient.execute().createNamedDmlStatement("create-users").execute();
        dbClient.execute().createNamedDmlStatement("create-albums").execute();
        dbClient.execute().createNamedDmlStatement("create-todos").execute();
        dbClient.execute().createNamedDmlStatement("create-photos").execute();
        dbClient.execute().createNamedDmlStatement("create-posts").execute();
        dbClient.execute().createNamedDmlStatement("create-comments").execute();
    }

}
