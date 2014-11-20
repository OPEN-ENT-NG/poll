package net.atos.entng.poll.service;

import org.entcore.common.service.impl.MongoDbCrudService;

/**
 * Implementation par defaut de l'interface {@link PollService}.
 * @author Atos
 */
public class PollServiceImpl extends MongoDbCrudService implements PollService {

	/**
	 * Constructeur par defaut.
	 * @param collection la collection MongoDB associee au sondage.
	 */
	public PollServiceImpl(String collection) {
		super(collection);
	}

}
