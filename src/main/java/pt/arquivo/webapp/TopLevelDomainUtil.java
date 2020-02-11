package pt.arquivo.webapp;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

/**
 * Refactor from code directly on jsp's.
 *
 * @author Ivo Branco <ivo.branco@fccn.pt>
 *
 */
public class TopLevelDomainUtil {

	public static boolean hostnameEndsWithValidTld(String hostname) throws IOException {
		return getToLevelDomains().stream().anyMatch(tld -> hostname.endsWith(tld.toLowerCase()));
	}

	private static List<String> getToLevelDomains() throws IOException {
		Properties prop = new Properties();
		prop.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("validTLDs/valid.properties"));
		String tldsLine = prop.getProperty("valid.tld");
		return Arrays.asList(tldsLine.split("\t"));
	}

	public static boolean contains(String tld) throws IOException {
		return getToLevelDomains().contains(tld);
	}
}
