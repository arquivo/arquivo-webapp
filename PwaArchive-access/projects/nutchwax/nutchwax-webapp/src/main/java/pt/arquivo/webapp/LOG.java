package pt.arquivo.webapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Ivo Branco <ivo.branco@fccn.pt>
 *
 */
public class LOG {

	private static Logger logger = LoggerFactory.getLogger(LOG.class);

	public static void debug(String message) {
		logger.debug(message);
	}

	public static void error(String message) {
		logger.error(message);
	}

	public static void info(String message) {
		logger.info(message);
	}

}
