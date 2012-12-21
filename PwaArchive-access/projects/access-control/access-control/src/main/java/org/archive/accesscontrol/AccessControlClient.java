package org.archive.accesscontrol;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import org.archive.accesscontrol.model.Rule;
import org.archive.accesscontrol.model.RuleSet;
import org.archive.accesscontrol.robotstxt.CachingRobotClient;
import org.archive.accesscontrol.robotstxt.RobotClient;
import org.archive.net.PublicSuffixes;
import org.archive.util.ArchiveUtils;
import org.archive.util.SURT;

/**
 * The Exclusions Client provides a facade for accessing a remote or local
 * exclusions oracle.
 * 
 * In future it will perform heavy caching to prevent queries about related and
 * recently-accessed pages from needing to hit the oracle.
 * 
 * @author aosborne
 */
public class AccessControlClient {
    protected RuleDao ruleDao;
    protected RobotClient robotClient;
    private boolean robotLookupsEnabled = true;
    private boolean robotPreparationEnabled = true;
    private String robotUserAgent = "wayback-access-control";

    public AccessControlClient(RuleDao ruleDao, RobotClient robotClient) {
        super();
        this.ruleDao = ruleDao;
        this.robotClient = robotClient;
    }

    /**
     * Create a new (caching) client to query a remote oracle.
     * 
     * @param oracleUrl
     *            Base url of the oracle webapp. eg.
     *            "http://localhost:8080/exclusions-oracle/"
     */
    public AccessControlClient(String oracleUrl) {
        this(new CachingRuleDao(oracleUrl), new CachingRobotClient());
    }

    /**
     * Return the best-matching policy for the requested document.
     * 
     * @param url
     *            URL of the requested document.
     * @param captureDate
     *            Date the document was archived.
     * @param retrievalDate
     *            Date of retrieval (usually now).
     * @param who
     *            Group name of the user accessing the document.
     * @return Access-control policy that should be enforced. eg "robots",
     *         "block" or "allow".
     * @throws RobotsUnavailableException 
     * @throws RuleOracleUnavailableException 
     */
    public String getPolicy(String url, Date captureDate, Date retrievalDate,
            String who) throws RobotsUnavailableException, RuleOracleUnavailableException {
        Rule matchingRule = getRule(url, captureDate, retrievalDate, who);
        
        if (robotLookupsEnabled && matchingRule != null && "robots".equals(matchingRule.getPolicy())) {
            try {
                if (robotClient.isRobotPermitted(url, robotUserAgent)) {
                    return "allow";
                } else {
                    return "block";
                }
            } catch (IOException e) {
                throw new RobotsUnavailableException(e);
            }
        }
        return matchingRule.getPolicy();
    }

    /**
     * Return the most specific matching rule for the requested document.
     * 
     * @param url
     *            URL of the requested document.
     * @param captureDate
     *            Date the document was archived.
     * @param retrievalDate
     *            Date of retrieval (usually now).
     * @param who
     *            Group name of the user accessing the document.
     * @return
     * @throws RuleOracleUnavailableException 
     */
    public Rule getRule(String url, Date captureDate, Date retrievalDate,
            String who) throws RuleOracleUnavailableException {
        url = ArchiveUtils.addImpliedHttpIfNecessary(url);
        String surt = SURT.fromURI(url);
        String publicSuffix = PublicSuffixes
                .reduceSurtToTopmostAssigned(getSurtAuthority(surt));

            RuleSet rules =  ruleDao.getRuleTree(getScheme(surt) + "(" + publicSuffix);

        Rule matchingRule = rules.getMatchingRule(surt, captureDate,
                retrievalDate, who);
        return matchingRule;
    }
    
    
    /**
     * This method allows the client to prepare for lookups from a given set of
     * urls. This can warm up a cache and/or enable a mass data transfer to be done in
     * parallel.
     * 
     * @param surts
     */
    public void prepare(Collection<String> urls) {
        ArrayList<String> publicSuffixes = new ArrayList<String>(urls.size());
        for (String url: urls) {
            String surt = SURT.fromURI(ArchiveUtils.addImpliedHttpIfNecessary(url));
            publicSuffixes.add(PublicSuffixes
                    .reduceSurtToTopmostAssigned(getSurtAuthority(surt)));
        }
        ruleDao.prepare(publicSuffixes);
        
        if (robotPreparationEnabled) {
            robotClient.prepare(urls, robotUserAgent);
        }
    }

    protected String getSurtAuthority(String surt) {
        int indexOfOpen = surt.indexOf("://(");
        int indexOfClose = surt.indexOf(')');
        if (indexOfOpen == -1 || indexOfClose == -1
                || ((indexOfOpen + 4) >= indexOfClose)) {
            return surt;
        }
        return surt.substring(indexOfOpen + 4, indexOfClose);
    }

    protected static String getScheme(String surt) {
        int i = surt.indexOf("://");
        int j = surt.indexOf(':');
        if (i >= 0 && i == j) {
            return surt.substring(0, i + 3);
        } else {
            return "";
        }
    }


    public String getRobotUserAgent() {
        return robotUserAgent;
    }

    public void setRobotUserAgent(String robotUserAgent) {
        this.robotUserAgent = robotUserAgent;
    }

    public boolean isRobotLookupsEnabled() {
        return robotLookupsEnabled;
    }

    public void setRobotLookupsEnabled(boolean robotLookupsEnabled) {
        this.robotLookupsEnabled = robotLookupsEnabled;
    }

    public boolean isRobotPreparationEnabled() {
        return robotPreparationEnabled;
    }

    public void setRobotPreparationEnabled(boolean robotPreparationEnabled) {
        this.robotPreparationEnabled = robotPreparationEnabled;
    }
    
    /**
     * Use a proxy server when fetching robots.txt data.
     * @param host
     * @param port
     */
    public void setRobotProxy(String host, int port) {
        robotClient.setRobotProxy(host, port);
    }

}
