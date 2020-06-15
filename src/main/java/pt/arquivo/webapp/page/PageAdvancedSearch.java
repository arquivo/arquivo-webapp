package pt.arquivo.webapp.page;


import java.io.IOException;

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
@WebServlet("/page/advanced/search")
@SuppressWarnings("serial")
public class PageAdvancedSearch extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		request.getRequestDispatcher("/screens/pageAdvancedSearch.jsp").forward(request, response);
	}

}
