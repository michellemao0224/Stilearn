package test;

import org.apache.log4j.Logger;

public class TestLog4j {

	private static Logger logger = Logger.getLogger(TestLog4j.class);

	public static void main(String[] args) {
		logger.debug("Debug msg");
		logger.info("Normal msg");
		logger.warn("Warn msg");
		logger.error("Error msg");
		logger.fatal("Fatal msg");
	}

}
