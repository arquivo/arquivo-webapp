package pt.arquivo.webapp;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.stream.Collectors;

/**
 * Load configuration properties.
 *
 * @author Ivo Branco <ivo.branco@fccn.pt>
 *
 */
public class Configuration {

	private static Map<String, String> properties = new HashMap<String, String>();

	static {
		Properties properties = new Properties();
		try {
			properties.load(Configuration.class.getResourceAsStream("/configuration.properties"));
		} catch (IOException e) {
			throw new RuntimeException(
					"Error loading configuration properties, check if there is a configuration.properties on war.", e);
		}
		Configuration.properties.putAll( //
				properties.entrySet() //
						.stream() //
						.collect(Collectors.toMap(e -> e.getKey().toString(), //
								e -> e.getValue().toString())));
	}

	public static String get(String configurationKey, String defaultValue) {
		return properties.getOrDefault(configurationKey, defaultValue);
	}

	public static Optional<String> get(String configurationKey) {
		return Optional.ofNullable(properties.get(configurationKey));
	}
}
