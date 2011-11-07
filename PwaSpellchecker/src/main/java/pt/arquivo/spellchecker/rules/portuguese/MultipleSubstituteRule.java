package pt.arquivo.spellchecker.rules.portuguese;

import pt.arquivo.spellchecker.rules.NormalizingRule;

import org.apache.log4j.Logger;

/**
 * Substitute probable mistakes of multiple chars difference
 * @author Miguel Costa
 */
public class MultipleSubstituteRule implements NormalizingRule {
	private static Logger logger = null;

	public MultipleSubstituteRule() {
		logger = Logger.getLogger(MultipleSubstituteRule.class.getName());
	}

	public String normalizeByRule(String word) {
		String normalized = null;	
		StringBuffer sbuf=new StringBuffer();
		char lastChars[]=new char[3];
		int nChars=0;

		logger.debug("Word being evaluated:\t"+ word);

		for (int i=0;i<word.length();i++) {			
			if (nChars<3) {
				lastChars[nChars]=word.charAt(i);
				nChars++;
			}

			logger.debug("Last chars:\t"+ lastChars[0] + lastChars[1] + lastChars[2]);
			
			if (nChars==3) {
				// three chars
				if (compareThreeChars(lastChars,"�es")) {
					sbuf.append("�os");
					nChars=0;
				}
				else if (compareThreeChars(lastChars,"�es")) {
					sbuf.append("�os");
					nChars=0;
				}
				else if (compareThreeChars(lastChars,"s�o")) {
					sbuf.append("��o");
					nChars=0;
				}
				else if (compareThreeChars(lastChars,"ssa")) {
					sbuf.append("�a");
					nChars=0;
				}
				else if (compareThreeChars(lastChars,"sso")) {
					sbuf.append("�o");
					nChars=0;
				}
				else if (compareThreeChars(lastChars,"ssu")) {					
					sbuf.append("�u");
					nChars=0;
				}
				else if (compareThreeChars(lastChars,"ss�")) {					
					sbuf.append("��");
					nChars=0;
				}
				else if (compareThreeChars(lastChars,"sse")) {
					sbuf.append("ce");
					nChars=0;
				}
				else if (compareThreeChars(lastChars,"ssi")) {
					sbuf.append("ci");
					nChars=0;
				}
				// two chars
				else if (compareTwoChars(lastChars,"sa")) {
					sbuf.append("�a");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"si")) {
					sbuf.append("ci");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"se")) {
					sbuf.append("ce");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"le")) {
					sbuf.append("re");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"er")) {
					sbuf.append("re");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"ex")) {
					sbuf.append("es");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"je")) {
					sbuf.append("ge");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"ji")) {
					sbuf.append("gi");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"xi")) {
					sbuf.append("ci");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"�o") && i==word.length()) {
					sbuf.append("am");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"ch")) {
					sbuf.append("x");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"cc")) {
					sbuf.append("c");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"c�")) {
					sbuf.append("�");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"ct")) {
					sbuf.append("t");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"qu")) {
					sbuf.append("k");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"�e")) {
					sbuf.append("�");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"ee")) {
					sbuf.append("�");
					nChars=1;
				}
				else if (compareTwoChars(lastChars,"�s")) {
					sbuf.append("ez");
					nChars=1;
				} 
				/*
				else if (compareTwoChars(lastChars,"oo")) {
					sbuf.append("o");
					nChars=0;
				}
				*/			
				else {				
					sbuf.append(lastChars[0]);					
					nChars=2;										
				}
				
				if (nChars==2) {
					lastChars[0]=lastChars[1];
					lastChars[1]=lastChars[2];
				}
				else if (nChars==1) {
					lastChars[0]=lastChars[2];
				}
			}						
		}
		for (int i=0;i<nChars;i++) {
			sbuf.append(lastChars[i]);
		}
		normalized = sbuf.toString();

		logger.debug("Word normalized:\t"+ normalized);

		return normalized;
	}
	
	private boolean compareTwoChars(char[] carray, String s) {
		return (carray[0]==s.charAt(0) && carray[1]==s.charAt(1));
	}
	
	private boolean compareThreeChars(char[] carray, String s) {
		return (carray[0]==s.charAt(0) && carray[1]==s.charAt(1) && carray[2]==s.charAt(2));
	}
	
	
	/**
	 * Main
	 * @param args
	 */		
	/*
	public static void main(String[] args) {
		MultipleSubstituteRule rule=new MultipleSubstituteRule();		
		String word="ssical";
		System.out.println(rule.normalizeByRule(word));
		word="comessar";
		System.out.println(rule.normalizeByRule(word));
		word="chaile";
		System.out.println(rule.normalizeByRule(word));
		word="chailech";
		System.out.println(rule.normalizeByRule(word));
		word="chadrez";
		System.out.println(rule.normalizeByRule(word));
		
		word="ssical";
		System.out.println(rule.normalizeByRule(word));
		word="ssocal";
		System.out.println(rule.normalizeByRule(word));
		word="ssocal�o";
		System.out.println(rule.normalizeByRule(word));
		word="ssocal�ox";
		System.out.println(rule.normalizeByRule(word));
		word="victor";
		System.out.println(rule.normalizeByRule(word));	
		word="cidad�es";		
		System.out.println(rule.normalizeByRule(word));
		word="calsado";		
		System.out.println(rule.normalizeByRule(word));
		word="calado";		
		System.out.println(rule.normalizeByRule(word));
	}
	*/
}
