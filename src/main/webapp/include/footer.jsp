<script src="/js/swiper.min.js"></script>
<script type="text/javascript">MENU.close()</script>
<script type="text/javascript">
	<!-- Initialize Swiper -->
    var menuButton = document.querySelector('#menuButton');
    var openMenu = function () {
      $('.logo-main-div').css("position:fixed!important; width:initial;");
      $('#menuWrapper').removeClass('transform-none');
      $('#menuSwiperSlide').removeClass('hidden');
	    swiper.allowSlidePrev = true;
      swiper.slidePrev();
    };
    var swiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      initialSlide: 1,
      resistanceRatio: 0,
      slideToClickedSlide: true,
      draggable: false,
      on: {
        slideChangeTransitionStart: function () {
          var slider = this;
          if (slider.activeIndex === 0) { /*open menu*/
          	this.allowSlidePrev = true;
          	$('#mainMask').fadeIn('fast');
            menuButton.classList.add('open');
            $('.swiper-container').removeClass('swiper-no-swiping');
            // required because of slideToClickedSlide
            menuButton.removeEventListener('click', openMenu, true);
          } else { /*close menu*/
          	 this.allowSlidePrev = false;
          	$('.swiper-container').addClass('swiper-no-swiping');
          	$('#mainMask').fadeOut('fast');
            menuButton.classList.remove('open');
          }
        }
        , slideChangeTransitionEnd: function () {
          var slider = this;
          if (slider.activeIndex === 1) {
            menuButton.addEventListener('click', openMenu, true);
          }
        },
      }
    });
    swiper.allowSlidePrev = false;
    /*$( "#menuButton" ).click(function() {
      openMenu();
    });*/
</script>

<div id="newFooterWrapper">
  <div class="site-footer footer-bar-active footer-bar-align-justified">
    <div id="footer-widgets" class="site footer-widgets">
      <div class="footer-widgets-container grid-container grid-parent">
        <div class="inside-footer-widgets">
          <div class="footer-widget-1 grid-parent grid-25 tablet-grid-50 mobile-grid-100">
            <aside id="wp_editor_widget-8" class="widget inner-padding WP_Editor_Widget">
              <h4 class="widget-title"><fmt:message key="footer.section.about"/></h4>
              <ul>
                <li><fmt:message key="footer.section.about.objectives"/></li>
                <li><fmt:message key="footer.section.about.publications"/></li>
                <li><fmt:message key="footer.section.about.pages-examples"/></li>
                <li><fmt:message key="footer.section.about.press"/></li>
                <li><fmt:message key="footer.section.about.services"/></li>
                <li><fmt:message key="footer.section.about.terms-conditions"/></li>
              </ul>
            </aside>            
          </div>
          <div class="footer-widget-2 grid-parent grid-25 tablet-grid-50 mobile-grid-100">
            <aside id="wp_editor_widget-9" class="widget inner-padding WP_Editor_Widget">
              <h4 class="widget-title"><fmt:message key="footer.section.social"/></h4>
              <ul>
                <li><fmt:message key="footer.section.social.mailinglist"/></li>
                <li><fmt:message key="footer.section.social.news"/></li>
                <li><fmt:message key="footer.section.social.twitter"/></li>
                <li><fmt:message key="footer.section.social.facebook"/></li>
                <li><fmt:message key="footer.section.social.rss"/></li>
                <li><fmt:message key="footer.section.social.video"/></li>
              </ul>
            </aside>
          </div>
          <div class="footer-widget-3 grid-parent grid-25 tablet-grid-50 mobile-grid-100">
            <aside id="wp_editor_widget-11" class="widget inner-padding WP_Editor_Widget">
              <h4 class="widget-title"><fmt:message key="footer.section.collaboration"/></h4>
              <ul>
                <li><fmt:message key="footer.section.collaboration.suggest-website"/></li>
                <li><fmt:message key="footer.section.collaboration.divulgation"/></li>
                <li><fmt:message key="footer.section.collaboration.recommendations"/></li>
                <li><fmt:message key="footer.section.collaboration.giving"/></li>
                <li><fmt:message key="footer.section.collaboration.projects"/></li>
              </ul>
            </aside>
          </div>
          <div class="footer-widget-4 grid-parent grid-25 tablet-grid-50 mobile-grid-100">
            <aside id="wp_editor_widget-12" class="widget inner-padding WP_Editor_Widget">
              <h4 class="widget-title"><fmt:message key="footer.section.help"/></h4>
              <ul>
                <li><fmt:message key="footer.section.help.search"/></li>
                <li><fmt:message key="footer.section.help.advanced-search"/></li>
                <li><fmt:message key="footer.section.help.access"/></li>
                <li><fmt:message key="footer.section.help.crawl"/></li>
                <li><fmt:message key="footer.section.help.faq"/></li>
                <li><fmt:message key="footer.section.help.training"/></li>
                <li><fmt:message key="footer.section.help.contact"/></li>         
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </div>
    <footer class="site-info" itemtype="http://schema.org/WPFooter" itemscope="itemscope">
      <div class="inside-site-info grid-container grid-parent">
        <div class="footer-bar">
          <aside id="wp_editor_widget-10" class="widget inner-padding WP_Editor_Widget">
            <div class="footerDiv">
              <div class="footerImage">
                <a title="<fmt:message key='footer.sponsor.fccn'/>" href="//fccn.pt">
                  <img title="<fmt:message key='footer.sponsor.fccn'/>" class="fright size-full wp-image-2912 alignleft" src="/img/logo-fccn.png" alt="FCT| FCCN logo oficial" width="" height="49">
                </a>
              </div>
              <div class="footerImage2">
                <a title="<fmt:message key='footer.sponsor.mctes'/>" href="//www.portugal.gov.pt/pt/ministerios/mctes.aspx">
                  <img title="<fmt:message key='footer.sponsor.mctes'/>" class="fleft alignnone wp-image-2902" src="//sobre.arquivo.pt/wp-content/uploads/10-Digital_PT_4C_H_FC_MCTES_cinza.png" 
                    alt="Logo oficial <fmt:message key='footer.sponsor.mctes'/>" width="" height="49">
                </a>
              </div>
            </div>
          </aside>
        </div>
        <div class="copyright-bar">
        </div>
      </div>
    </footer>
  </div>
</div>  
