<%
/** Query String ***/
String queryString = request.getParameter("query") != null ? URLDecoder.decode(request.getParameter("query")) : null;
final String QUERY_REGEX =  "(-?&quot;.*?&quot;|\\S+)+";
/*"(\".+?\"|\\S+)*";*/

StringBuilder and = new StringBuilder();
StringBuilder phrase = new StringBuilder();
StringBuilder not = new StringBuilder();
int hitsPerPage = request.getParameter("hitsPerPage") != null ? Integer.parseInt(request.getParameter("hitsPerPage")) : 10;
String format = request.getParameter("format") != null ? request.getParameter("format") : "";
String imagesSize = request.getParameter("size") != null ? request.getParameter("size") : "";
String site = request.getParameter("site") != null ? request.getParameter("site") : "";
String safeSearch = request.getParameter("safeSearch") != null ? request.getParameter("safeSearch") : "";

String sortType = request.getParameter("sort") != null ? request.getParameter("sort") : null;
boolean sortReverse = "true".equals(request.getParameter("reverse")) ? true : false;

if (queryString != null) {		
	Pattern regex = Pattern.compile(QUERY_REGEX);
	Matcher match = regex.matcher(queryString);
	boolean inPhrase = false;
	while( match.find() ) {
		if (match.group(1) != null) {
			String parcel = match.group(1);

			if (parcel.charAt(0) == '-') {					//check for negation
				if (parcel.length() > 1 				//check if just "-" is present
					&& ( parcel.startsWith("-&quot;")		//check for phrase negation
					|| parcel.contains(":") ) )			//check for operator negation
				{
					continue;		
				} else {
					//It's a term negation
					if(not.length() != 0) {
						not.append(" ");
					}
					not.append( parcel.substring(1));
				}
			} else if ( parcel.contains("\"") || inPhrase) {					//check for phrase
				if (parcel.contains("\""))
					inPhrase = !inPhrase;

				if (phrase.length() != 0) {
					phrase.append(" ");
				}
				parcel = parcel.replaceAll("\"", "");
				phrase.append(parcel);
				
			} else if (parcel.contains(":")) {				//check for option
				if (parcel.startsWith("site:")) {
					site = parcel.substring(parcel.indexOf(':')+1);
				} else if (parcel.startsWith("type:")) {
					format += parcel.substring(parcel.indexOf(':')+1) + " ";
				} else if (parcel.startsWith("size:")) {
					imagesSize += parcel.substring(parcel.indexOf(':')+1) + " ";
				} else if (parcel.startsWith("safe:")) {
					safeSearch = parcel.substring(parcel.indexOf(':')+1);
				} else  {
					// is other term like: aaa:bbb
					if (and.length() != 0) {
						and.append(" ");
					}
					and.append(parcel);
				}
			} else {								//words
				if (and.length() != 0) {
					and.append(" ");
				}
				and.append(parcel);
			}
		}
	}
}	

%>
