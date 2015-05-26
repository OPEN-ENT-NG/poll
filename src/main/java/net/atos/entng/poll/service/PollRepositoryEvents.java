package net.atos.entng.poll.service;

import org.entcore.common.service.impl.MongoDbRepositoryEvents;
import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonArray;

import fr.wseduc.mongodb.MongoDb;

public class PollRepositoryEvents extends MongoDbRepositoryEvents {

    private final MongoDb mongo = MongoDb.getInstance();

    public PollRepositoryEvents() {
        super("net-atos-entng-poll-controllers-PollController|delete");
    }

    @Override
    public void exportResources(String exportId, String userId,
            JsonArray groups, String exportPath, String locale, String host, final Handler<Boolean> handler) {
        // TODO
        log.warn("Method exportResources is not implemented in PollRepositoryEvents");
    }

}
