package net.atos.entng.poll.controllers;

import net.atos.entng.poll.service.PollServiceImpl;

import org.entcore.common.mongodb.MongoDbControllerHelper;
import org.vertx.java.core.http.HttpServerRequest;

import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Delete;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.rs.Put;
import fr.wseduc.security.SecuredAction;

/**
 * Controlleur pour gerer les routes des sondages.
 * @author Atos
 */
public class PollController extends MongoDbControllerHelper {

	/**
	 * Constructeur par defaut.
	 * @param collection collection MongoDB a requeter.
	 */
	public PollController(String collection) {
		super(collection);
		this.setCrudService(new PollServiceImpl(collection));
	}

	@Get("")
	@SecuredAction("poll.view")
	public void view(HttpServerRequest request) {
		renderView(request);
	}

	@Override
	@Get("/list")
	@ApiDoc("Permet de liter l'ensemble des sondages")
	@SecuredAction("poll.list")
	public void list(HttpServerRequest request) {
		super.list(request);
	}

	@Override
	@Post("")
	@ApiDoc("Permet de creer un nouveau sondage")
	@SecuredAction("poll.create")
	public void create(HttpServerRequest request) {
		super.create(request);
	}

	@Override
	@Get("/:id")
	@ApiDoc("Permet de recuperer le sondage associe au l'identifiant passe en parametre")
	@SecuredAction("poll.retrieve")
	public void retrieve(HttpServerRequest request) {
		super.retrieve(request);
	}

	@Override
	@Put("/:id")
	@ApiDoc("Permet de mettre a jour le sondage associe au l'identifiant passe en parametre")
	@SecuredAction("poll.update")
	public void update(HttpServerRequest request) {
		super.update(request);
	}

	@Override
	@Delete("/:id")
	@ApiDoc("Permet de supprimer le sondage associe au l'identifiant passe en parametre")
	@SecuredAction("poll.delete")
	public void delete(HttpServerRequest request) {
		super.delete(request);
	}

}
