package net.atos.entng.poll.controllers;

import org.entcore.common.mongodb.MongoDbControllerHelper;
import org.vertx.java.core.http.HttpServerRequest;

import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Delete;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.rs.Put;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;

/**
 * Controller to manage URL paths for polls.
 * @author Atos
 */
public class PollController extends MongoDbControllerHelper {

    /**
     * Default constructor.
     * @param collection MongoDB collection to request.
     */
    public PollController(String collection) {
        super(collection);
    }

    @Get("")
    @SecuredAction("poll.view")
    public void view(HttpServerRequest request) {
        renderView(request);
    }

    @Override
    @Get("/list/all")
    @ApiDoc("Allows to list all polls")
    @SecuredAction("poll.list")
    public void list(HttpServerRequest request) {
        super.list(request);
    }

    @Override
    @Post("")
    @ApiDoc("Allows to create a new poll")
    @SecuredAction("poll.create")
    public void create(HttpServerRequest request) {
        super.create(request);
    }

    @Override
    @Get("/:id")
    @ApiDoc("Allows to get a poll associted to the given identifier")
    @SecuredAction(value = "poll.read", type = ActionType.RESOURCE)
    public void retrieve(HttpServerRequest request) {
        super.retrieve(request);
    }

    @Override
    @Put("/:id")
    @ApiDoc("Allows to update a poll associted to the given identifier")
    @SecuredAction(value = "poll.manager", type = ActionType.RESOURCE)
    public void update(HttpServerRequest request) {
        super.update(request);
    }

    @Override
    @Delete("/:id")
    @ApiDoc("Allows to delete a poll associted to the given identifier")
    @SecuredAction(value = "poll.manager", type = ActionType.RESOURCE)
    public void delete(HttpServerRequest request) {
        super.delete(request);
    }

    @Get("/share/json/:id")
    @ApiDoc("Allows to get the current sharing of the poll given by its identifier")
    @SecuredAction(value = "poll.manager", type = ActionType.RESOURCE)
    public void share(HttpServerRequest request) {
        shareJson(request, false);
    }

    @Put("/share/json/:id")
    @ApiDoc("Allows to update the current sharing of the poll given by its identifier")
    @SecuredAction(value = "poll.manager", type = ActionType.RESOURCE)
    public void sharePollSubmit(HttpServerRequest request) {
        shareJsonSubmit(request, null);
    }

    @Put("/share/remove/:id")
    @ApiDoc("Allows to remove the current sharing of the poll given by its identifier")
    @SecuredAction(value = "poll.manager", type = ActionType.RESOURCE)
    public void removeSharePoll(HttpServerRequest request) {
        removeShare(request, false);
    }

}
