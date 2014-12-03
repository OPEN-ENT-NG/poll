package net.atos.entng.poll;

import net.atos.entng.poll.controllers.PollController;

import org.entcore.common.http.BaseServer;
import org.entcore.common.http.filter.ShareAndOwner;
import org.entcore.common.mongodb.MongoDbConf;

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

        MongoDbConf conf = MongoDbConf.getInstance();
        conf.setCollection(POLL_COLLECTION);
        conf.setResourceIdLabel("id");

        setDefaultResourceFilter(new ShareAndOwner());
        addController(new PollController(POLL_COLLECTION));
    }

}
