package net.atos.entng.poll.service;

import org.entcore.common.service.impl.MongoDbCrudService;

/**
 * Default implementation of the interface {@link PollService}.
 * @author Atos
 */
public class PollServiceImpl extends MongoDbCrudService implements PollService {

	/**
	 * Default constructor.
	 * @param collection MongoDB collection associated to polls.
	 */
	public PollServiceImpl(String collection) {
		super(collection);
	}

}
