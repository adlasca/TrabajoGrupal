package org.web;


import io.helidon.webserver.WebServer;
import io.helidon.webserver.http.HttpRouting;

public class Main {
    public static void main(String[] args) {
        WebServer.builder()
                .host("localhost")
                .port(8080)
                .build().start();

    }
}