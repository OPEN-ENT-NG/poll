package net.atos.entng.poll.controllers;

import org.entcore.common.mongodb.MongoDbControllerHelper;
import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;
import org.vertx.java.core.Handler;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonObject;

import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Delete;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.rs.Put;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.request.RequestUtils;

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
    public void create(final HttpServerRequest request) {
        RequestUtils.bodyToJson(request, pathPrefix + "poll", new Handler<JsonObject>() {

            @Override
            public void handle(JsonObject event) {
                PollController.super.create(request);
            }
        });
    }

    @Override
    @Get("/:id")
    @ApiDoc("Allows to get a poll associated to the given identifier")
    @SecuredAction(value = "poll.read", type = ActionType.RESOURCE)
    public void retrieve(HttpServerRequest request) {
        super.retrieve(request);
    }

    @Override
    @Put("/:id")
    @ApiDoc("Allows to update a poll associated to the given identifier")
    @SecuredAction(value = "poll.manager", type = ActionType.RESOURCE)
    public void update(final HttpServerRequest request) {
        RequestUtils.bodyToJson(request, pathPrefix + "poll", new Handler<JsonObject>() {

            @Override
            public void handle(JsonObject event) {
                PollController.super.update(request);
            }
        });
    }

    @Put("/vote/:id")
    @ApiDoc("Allows to vote to the poll associated to the given identifier")
    @SecuredAction(value = "poll.contrib", type = ActionType.RESOURCE)
    public void vote(HttpServerRequest request) {
        update(request);
    }

    @Override
    @Delete("/:id")
    @ApiDoc("Allows to delete a poll associated to the given identifier")
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
    public void sharePollSubmit(final HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, new Handler<UserInfos>(){
            @Override
            public void handle(final UserInfos user){
                if (user != null) {
                    final String id = request.params().get("id");
                    if (id == null || id.trim().isEmpty()) {
                        badRequest(request);
                        return;
                    }
                    
                    JsonObject params = new JsonObject();
                    params.putString("uri", "/userbook/annuaire#" + user.getUserId() + "#" + user.getType())
                    .putString("username", user.getUsername())
                    .putString("pollUri", "/poll#/view/" + id);
                    shareJsonSubmit(request, "notify-poll-share.html", false, params, "question");
                }
            }
        });
    }

    @Put("/share/remove/:id")
    @ApiDoc("Allows to remove the current sharing of the poll given by its identifier")
    @SecuredAction(value = "poll.manager", type = ActionType.RESOURCE)
    public void removeSharePoll(HttpServerRequest request) {
        removeShare(request, false);
    }

}
