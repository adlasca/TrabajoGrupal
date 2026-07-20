package org.web.utils;

import io.helidon.common.uri.UriValidationException;
import io.helidon.http.RequestException;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRouting;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;

import java.util.Map;

public class GlobalException {

    public static void register(HttpRouting.Builder routing) {
        routing
                .error(UriValidationException.class, GlobalException::validationError)
                .error(NumberFormatException.class, GlobalException::formatError)
                .error(RequestException.class, GlobalException::notFound);

    }

    private static void validationError(ServerRequest req, ServerResponse res, UriValidationException ex){
        res.status(Status.BAD_REQUEST_400)
                .send(Map.of("Error: ",ex.getMessage()));
    }

    private static void formatError(ServerRequest req, ServerResponse res, NumberFormatException ex){
        res.status(Status.BAD_REQUEST_400)
                .send(Map.of("Error: ",ex.getMessage()));
    }

    private static void notFound(ServerRequest req, ServerResponse res, RequestException ex){
        res.status(Status.NOT_FOUND_404)
                .send(Map.of("Error: ","id no existente en la base de datos"));
    }


}
