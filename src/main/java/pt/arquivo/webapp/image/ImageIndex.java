package pt.arquivo.webapp.image;

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
@WebServlet("/image")
@SuppressWarnings("serial")
public class ImageIndex extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.sendRedirect(request.getContextPath() + ImageSearch.class.getAnnotation(WebServlet.class).value()[0]);
	}

}
