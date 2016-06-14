/*
 * Copyright © Région Nord Pas de Calais-Picardie,  Département 91, Région Aquitaine-Limousin-Poitou-Charentes, 2016.
 *
 * This file is part of OPEN ENT NG. OPEN ENT NG is a versatile ENT Project based on the JVM and ENT Core Project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation (version 3 of the License).
 *
 * For the sake of explanation, any module that communicate over native
 * Web protocols, such as HTTP, with OPEN ENT NG is outside the scope of this
 * license and could be license under its own terms. This is merely considered
 * normal use of OPEN ENT NG, and does not fall under the heading of "covered work".
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

package net.atos.entng.poll;

import net.atos.entng.poll.controllers.PollController;
import net.atos.entng.poll.service.PollRepositoryEvents;

import net.atos.entng.poll.service.PollSearchingEvents;
import org.entcore.common.http.BaseServer;
import org.entcore.common.http.filter.ShareAndOwner;
import org.entcore.common.mongodb.MongoDbConf;
import org.entcore.common.service.impl.MongoDbSearchService;

/**
 * Server to manage polls. This class is the entry point of the Vert.x module.
 * @author Atos
 */
public class Poll extends BaseServer {

    /**
     * Constant to define the MongoDB collection to use with this module.
     */
    public static final String POLL_COLLECTION = "poll";

    /**
     * Entry point of the Vert.x module
     */
    @Override
    public void start() {
        super.start();
        // Set RepositoryEvents implementation used to process events published for transition
        setRepositoryEvents(new PollRepositoryEvents());
        setSearchingEvents(new PollSearchingEvents(new MongoDbSearchService(POLL_COLLECTION)));

        MongoDbConf conf = MongoDbConf.getInstance();
        conf.setCollection(POLL_COLLECTION);
        conf.setResourceIdLabel("id");

        setDefaultResourceFilter(new ShareAndOwner());
        addController(new PollController(POLL_COLLECTION));
    }

}
