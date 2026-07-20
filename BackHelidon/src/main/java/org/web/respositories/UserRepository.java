package org.web.respositories;

import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import org.web.db.User;

import java.util.List;
import java.util.Optional;

public class UserRepository {
    private final DbClient dbClient;

    public UserRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    private User mapRow(DbRow row){
        return  User.builder()
                .id(row.column("id").as(Integer.class).get())
                .name(row.column("name").as(String.class).orElse(null))
                .username(row.column("username").as(String.class).orElse(null))
                .email(row.column("email").as(String.class).orElse(null))
                .addressStreet(row.column("address_street").as(String.class).orElse(null))
                .addressSuite(row.column("address_suite").as(String.class).orElse(null))
                .addressCity(row.column("address_city").as(String.class).orElse(null))
                .addressZipcode(row.column("address_zipcode").as(String.class).orElse(null))
                .addressGeoLat(row.column("address_geo_lat").as(String.class).orElse(null))
                .addressGeoLng(row.column("address_geo_lng").as(String.class).orElse(null))
                .phone(row.column("phone").as(String.class).orElse(null))
                .website(row.column("website").as(String.class).orElse(null))
                .companyName(row.column("company_name").as(String.class).orElse(null))
                .companyCatchPhrase(row.column("company_catch_phrase").as(String.class).orElse(null))
                .companyBs(row.column("company_bs").as(String.class).orElse(null))
                .build();
    }

    public List<User> findAll() {
        return  dbClient.execute()
                .createNamedQuery("select-users")
                .execute()
                .map(this::mapRow)
                .toList();
    }

    public Optional<User> findById(Integer id) {
        return dbClient.execute()
                .createNamedGet("select-userId")
                .addParam("id", id)
                .execute()
                .map(this::mapRow);
    }

    public User create(User user) {
        Integer generatedId = dbClient.execute()
                .createNamedQuery("insert-user")
                .addParam("name", user.name())
                .addParam("username", user.username())
                .addParam("email", user.email())
                .addParam("addressStreet", user.addressStreet())
                .addParam("addressSuite", user.addressSuite())
                .addParam("addressCity", user.addressCity())
                .addParam("addressZipcode", user.addressZipcode())
                .addParam("addressGeoLat", user.addressGeoLat())
                .addParam("addressGeoLng", user.addressGeoLng())
                .addParam("phone", user.phone())
                .addParam("website", user.website())
                .addParam("companyName", user.companyName())
                .addParam("companyCatchPhrase", user.companyCatchPhrase())
                .addParam("companyBs", user.companyBs())
                .execute()
                .map(row -> row.column("id").as(Integer.class).get())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Error al insertar el usuario"));

        return User.builder()
                .id(generatedId)
                .name(user.name()).username(user.username()).email(user.email())
                .addressStreet(user.addressStreet()).addressSuite(user.addressSuite())
                .addressCity(user.addressCity()).addressZipcode(user.addressZipcode())
                .addressGeoLat(user.addressGeoLat()).addressGeoLng(user.addressGeoLng())
                .phone(user.phone()).website(user.website()).companyName(user.companyName())
                .companyCatchPhrase(user.companyCatchPhrase()).companyBs(user.companyBs())
                .build();
    }

    public long update(Integer id, User user) {
        return dbClient.execute()
                .createNamedUpdate("update-user")
                .addParam("id", id)
                .addParam("name", user.name())
                .addParam("username", user.username())
                .addParam("email", user.email())
                .addParam("addressStreet", user.addressStreet())
                .addParam("addressSuite", user.addressSuite())
                .addParam("addressCity", user.addressCity())
                .addParam("addressZipcode", user.addressZipcode())
                .addParam("addressGeoLat", user.addressGeoLat())
                .addParam("addressGeoLng", user.addressGeoLng())
                .addParam("phone", user.phone())
                .addParam("website", user.website())
                .addParam("companyName", user.companyName())
                .addParam("companyCatchPhrase", user.companyCatchPhrase())
                .addParam("companyBs", user.companyBs())
                .execute();
    }

    public long deleteById(Integer id) {
        return dbClient.execute()
                .createNamedDelete("delete-user")
                .addParam("id", id)
                .execute();
    }

}
