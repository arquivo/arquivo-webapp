package pt.arquivo.webapp.image;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Ivo Branco <ivo.branco@fccn.pt>
 *
 */
@WebServlet("/image/view/*")
@SuppressWarnings("serial")
public class ImageViewTracking extends HttpServlet {

	private static Logger logger = LoggerFactory.getLogger(ImageViewTracking.class);

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

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

			logger.info("Image view tracking with trackingId: '{}', timestamp: '{}', archivedURL: '{}'", trackingId, timestamp, archivedUrl);
			response.setStatus(200);
			response.getWriter().append("Ok");
		} else {
			response.setStatus(400);
			response.getWriter().append("Not ok");
		}
	}

}
