package pt.arquivo.webapp.page;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pt.arquivo.webapp.Configuration;

/**
 *
 * @author Ivo Branco <ivo.branco@fccn.pt>
 *
 */
@WebServlet("/page/view/*")
@SuppressWarnings("serial")
public class PageViewTracking extends HttpServlet {

	private static Logger logger = LoggerFactory.getLogger(PageViewTracking.class);

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String redirectTo = null;
		String path = request.getPathInfo();
		Pattern pattern = Pattern.compile("/([^/]+)/([0-9]+)/(.*)");

		Matcher matcher = null;
		if (path != null) {
			matcher = pattern.matcher(path);
		}

		if (matcher != null && matcher.find()) {
			String trackingId = matcher.group(1);
			String timestamp = matcher.group(2);
			String archivedUrl = matcher.group(3);

			StringBuilder sb = new StringBuilder();
			sb.append(Configuration.get("wayback.url", "examples.com"));
			sb.append("/");
			sb.append(timestamp);
			sb.append("/");
			sb.append(archivedUrl);

			redirectTo = sb.toString();

			logger.info("Page view tracking with trackingId: '{}', timestamp: '{}', archivedURL: '{}'", trackingId, timestamp, archivedUrl);
		}

		if (redirectTo == null) {
			redirectTo = request.getContextPath() + PageSearch.class.getAnnotation(WebServlet.class).value()[0];
		}
		response.sendRedirect(redirectTo);
	}

}