package org.archive.accesscontrol.model;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.apache.commons.lang.ArrayUtils;

/**
 * An access control rules. Rules are organized into a tree based on SURT
 * components. The leafmost (most specific) matching rule takes precedence. In
 * the case that there are multiple matching rules for a particular node, allow
 * takes precedence over deny which takes precedence over robots.
 * 
 * @author aosborne
 * 
 */
public class Rule implements Comparable<Rule> {
    
    // in decreasing order of precedence
    public static final String[] POLICIES = { "allow", "block", "robots" };
    
    private Long id;
    private String policy;
    private String surt;
    private Date captureStart;
    private Date captureEnd;
    private Date retrievalStart;
    private Date retrievalEnd;
    private Integer secondsSinceCapture;
    private String who;
    private String privateComment;
    private String publicComment;
    private Boolean enabled;
    private boolean exactMatch;

    public Rule() {
        
    }
    
    public Rule(String policy, String surt) {
        super();
        this.policy = policy;
        this.surt = surt;
    }

    public Rule(String policy, String surt, Integer secondsSinceCapture) {
        super();
        this.policy = policy;
        this.surt = surt;
        this.secondsSinceCapture = secondsSinceCapture;
    }
    
    public Rule(String policy, String surt, String who) {
        this(policy, surt);
        this.who = who;
    }

    
    /**
     * @return the enabled
     */
    public Boolean getEnabled() {
        return enabled;
    }

    /**
     * @param enabled the enabled to set
     */
    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    /**
     * Populate the rule data fields by copying them from a given rule.
     */
    public void copyFrom(Rule rule) {
        setPolicy(rule.getPolicy());
        setCaptureStart(rule.getCaptureStart());
        setCaptureEnd(rule.getCaptureEnd());
        setPrivateComment(rule.getPrivateComment());
        setPublicComment(rule.getPublicComment());
        setRetrievalStart(rule.getRetrievalStart());
        setRetrievalEnd(rule.getRetrievalEnd());
        setSecondsSinceCapture(rule.getSecondsSinceCapture());
        setSurt(rule.getSurt());
        setWho(rule.getWho());
        setEnabled(rule.getEnabled());
        setExactMatch(rule.isExactMatch());
    }
    
    /**
     * @return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * @param id
     *            the id to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * @return the policy
     */
    public String getPolicy() {
        return policy;
    }

    /**
     * @param policy
     *            the policy to set
     */
    public void setPolicy(String policy) {
        this.policy = policy;
    }

    /**
     * @return the surt
     */
    public String getSurt() {
        return surt;
    }

    /**
     * @param surt
     *            the surt to set
     */
    public void setSurt(String surt) {
        this.surt = surt;
    }

    /**
     * @return the captureStart
     */
    public Date getCaptureStart() {
        return captureStart;
    }

    /**
     * @param captureStart
     *            the captureStart to set
     */
    public void setCaptureStart(Date captureStart) {
        this.captureStart = captureStart;
    }

    /**
     * @return the captureEnd
     */
    public Date getCaptureEnd() {
        return captureEnd;
    }

    /**
     * @param captureEnd
     *            the captureEnd to set
     */
    public void setCaptureEnd(Date captureEnd) {
        this.captureEnd = captureEnd;
    }

    /**
     * @return the retrievalStart
     */
    public Date getRetrievalStart() {
        return retrievalStart;
    }

    /**
     * @param retrievalStart
     *            the retrievalStart to set
     */
    public void setRetrievalStart(Date retrievalStart) {
        this.retrievalStart = retrievalStart;
    }

    /**
     * @return the retrievalEnd
     */
    public Date getRetrievalEnd() {
        return retrievalEnd;
    }

    /**
     * @param retrievalEnd
     *            the retrievalEnd to set
     */
    public void setRetrievalEnd(Date retrievalEnd) {
        this.retrievalEnd = retrievalEnd;
    }

    /**
     * @return the secondsSinceCapture
     */
    public Integer getSecondsSinceCapture() {
        return secondsSinceCapture;
    }

    /**
     * @param secondsSinceCapture
     *            the secondsSinceCapture to set
     */
    public void setSecondsSinceCapture(Integer secondsSinceCapture) {
        this.secondsSinceCapture = secondsSinceCapture;
    }

    /**
     * @return the who
     */
    public String getWho() {
        return who;
    }

    /**
     * @param who
     *            the who to set
     */
    public void setWho(String who) {
        this.who = who;
    }

    /**
     * @return the privateComment
     */
    public String getPrivateComment() {
        return privateComment;
    }

    /**
     * @param privateComment
     *            the privateComment to set
     */
    public void setPrivateComment(String privateComment) {
        this.privateComment = privateComment;
    }

    /**
     * @return the publicComment
     */
    public String getPublicComment() {
        return publicComment;
    }

    /**
     * @param publicComment
     *            the publicComment to set
     */
    public void setPublicComment(String publicComment) {
        this.publicComment = publicComment;
    }

    public Integer getPolicyId() {
        return ArrayUtils.indexOf(POLICIES, getPolicy());
    }
    
    /*
     * Rules are sorted in descending order of "specificity".
     * So we order first by SURT, exact-match,
     * then group, then policy.
     */
    public int compareTo(Rule o) {
        int i = getSurt().compareTo(o.getSurt());
        if (i == 0) {
            // exact matches come before non-exact
            if (isExactMatch() && !o.isExactMatch()) {
                i = -1;
            } else if (!isExactMatch() && o.isExactMatch()) {
                i = 1;
                
            // non-null groups come before null groups
            } else if (getWho() != null && o.getWho() == null) {
                i = -1;
            } else if (getWho() == null && o.getWho() != null) {
                i = 1;
            } else {
                i = getPolicyId().compareTo(o.getPolicyId());                
            }
            
            
            // if we're still equal try capture date start
            if (i == 0 && getCaptureStart() != null) {
                i = getCaptureStart().compareTo(o.getCaptureStart());
            }
            
            // and retrieval date
            if (i == 0 && getRetrievalStart() != null) {
                i = getRetrievalStart().compareTo(o.getRetrievalStart());                
            }
        }
        return i;
    }

    /**
     * @see #matches(String, Date, Date, String)
     */
    public boolean matches(String surt) {
        return surt.startsWith(getSurt());
    }

    /**
     * @see #matches(String, Date, Date, String)
     */
    public boolean matches(String surt, Date captureDate) {
        if (captureDate == null) {
            return matches(surt);
        }
        return matches(surt) 
            && (getCaptureStart() == null || captureDate.after(getCaptureStart())) 
            && (getCaptureEnd() == null || captureDate.before(getCaptureEnd()));
    }

    /**
     * @see #matches(String, Date, Date, String)
     */
    public boolean matches(String surt, Date captureDate, Date retrievalDate) {
        if (retrievalDate == null) {
            return matches(surt, captureDate);
        }
       
        // embargo period
        if (getSecondsSinceCapture() != null) {
            GregorianCalendar periodEnd = new GregorianCalendar();
            periodEnd.setTime(captureDate);
            periodEnd.add(Calendar.SECOND, getSecondsSinceCapture());
            
            if (retrievalDate.before(periodEnd.getTime())) {
                return false;
            }
        }
        return matches(surt, captureDate) 
            && (getRetrievalStart() == null || retrievalDate.after(getRetrievalStart())) 
            && (getRetrievalEnd() == null || retrievalDate.before(getRetrievalEnd()));
    }
    
    /**
     * Return true if the given request matches against this rule.
     * 
     * @param surt          SURT of requested document
     * @param captureDate   Capture date of document
     * @param retrievalDate
     * @param who2          Group name of requesting user
     * @return
     */
    public boolean matches(String surt, Date captureDate, Date retrievalDate, String who2) {
        return (who == null || who.length() == 0 || who.equals(who2))
        	&& matches(surt, captureDate, retrievalDate);
    }

    public boolean isExactMatch() {
        return exactMatch;
    }

    public void setExactMatch(boolean exactMatch) {
        this.exactMatch = exactMatch;
    }
}
