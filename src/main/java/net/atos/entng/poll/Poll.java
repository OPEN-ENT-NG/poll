package net.atos.entng.poll;

import net.atos.entng.poll.controllers.PollController;

import org.entcore.common.http.BaseServer;
import org.entcore.common.http.filter.ShareAndOwner;
import org.entcore.common.mongodb.MongoDbConf;

/**
 * Classes serveur pour gerer les sondages. Cette classe represente le point d'entree de Vert.x pour ce module.
 * @author Atos
 */
public class Poll extends BaseServer {

	/**
	 * Constante definissant la collection a utiliser dans MongoDB.
	 */
	public static final String POLL_COLLECTION = "poll";

	/**
	 * Point d'entree du module Vert.x
	 */
	@Override
	public void start() {
		super.start();

		MongoDbConf conf = MongoDbConf.getInstance();
		conf.setCollection(POLL_COLLECTION);
		conf.setResourceIdLabel("id");

		setDefaultResourceFilter(new ShareAndOwner());
		addController(new PollController(POLL_COLLECTION));
	}

}
