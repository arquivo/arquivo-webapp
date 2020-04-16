package pt.arquivo.webapp.url;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Ivo Branco <ivo.branco@fccn.pt>
 *
 */
@WebServlet("/url/search/*")
@SuppressWarnings("serial")
public class URLSearch extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String urlPrefix = request.getContextPath() + "/url/search/";
		String url = getFullURL(request); // https://arquivo.pt/url/search/19960101-20201230/fccn.pt
		String timeIntervalPlusUrlQuery = url.substring(url.indexOf(urlPrefix) + urlPrefix.length()); // 19960101-20201230/fccn.pt

		int urlStartPos;
		String from;
		String to;
		String typeShow = "list";

		boolean hasTimeInterval = timeIntervalPlusUrlQuery.matches("[0-9]+-[0-9]+(-[a-zA-Z]+)?/.*");
		if (hasTimeInterval) {

			int timeIntervalAndUrlQuerySeparatorPosition = timeIntervalPlusUrlQuery.indexOf("/");
			String timeIntervalStr = timeIntervalPlusUrlQuery.substring(0, timeIntervalAndUrlQuerySeparatorPosition);
			String[] timeIntervalArray = timeIntervalStr.split("-"); // { "19960101", "20201230" }

			from = timeIntervalArray[0]; // "19960101"
			to = timeIntervalArray[1]; // "20201230"
			urlStartPos = timeIntervalAndUrlQuerySeparatorPosition + 1;

			boolean typeShowTable = timeIntervalArray.length > 2 && timeIntervalArray[2].toLowerCase().equals("table");
			typeShow = typeShowTable ? "table" : "list";

		} else {
			from = "19960101";
			to = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
			urlStartPos = 0;
		}

		String timestampToOpen = null;
		if (timeIntervalPlusUrlQuery.matches("[0-9]+/.*")) {
			int timestampQuerySeparatorPosition = timeIntervalPlusUrlQuery.indexOf("/");
			timestampToOpen = timeIntervalPlusUrlQuery.substring(0, timestampQuerySeparatorPosition);
			urlStartPos = timestampQuerySeparatorPosition + 1;
		}

		request.setAttribute("startTs", from);
		request.setAttribute("endTs", to);
		if (timestampToOpen != null) {
			request.setAttribute("timestampToOpen", timestampToOpen);
		}
		request.setAttribute("typeShow", typeShow);

		String urlQuery = timeIntervalPlusUrlQuery.substring(urlStartPos, timeIntervalPlusUrlQuery.length());
		request.setAttribute("urlQuery", urlQuery);

		request.getRequestDispatcher("/url-search.jsp").forward(request, response);
	}

	public static String getFullURL(HttpServletRequest request) {
		StringBuilder requestURL = new StringBuilder(request.getRequestURL().toString());
		String queryString = request.getQueryString();

		if (queryString == null) {
			return requestURL.toString();
		} else {
			return requestURL.append('?').append(queryString).toString();
		}
	}
}
