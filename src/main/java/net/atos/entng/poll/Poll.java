package net.atos.entng.poll;

import net.atos.entng.poll.controllers.PollController;

import org.entcore.common.http.BaseServer;
import org.entcore.common.http.filter.ShareAndOwner;

/**
 * Classes serveur pour gerer les sondages. Cette classe represente le point d'entree de Vert.x pour ce module.
 * @author Atos
 */
public class Poll extends BaseServer {

	@Override
	public void start() {
		super.start();
		setDefaultResourceFilter(new ShareAndOwner());
		addController(new PollController());
	}

}
