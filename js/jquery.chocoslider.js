/************************************************************
 * Choco-Slider v2.0
 * http://chocoslider.alandawi.com.ar
 *
 * Desarrollado por Alan G. Dawidowicz
 * Web Site: www.alandawi.com.ar
 *
 * Copyright 2010
 * Licencia: MIT - http://es.wikipedia.org/wiki/Licencia_MIT
************************************************************/

(function($) {

  $.fn.chocoslider = function(options) {


    var settings = $.extend({}, $.fn.chocoslider.defaults, options);

    return this.each(function() {

      var vars = {
        currentSlide: 0,
        currentImage: '',
        totalSlides: 0,
        randAnim: '',
        running: false,
        paused: false,
        stop:false
      };
    

      var slider = $(this);
      slider.data('choco:vars', vars);
      slider.css('position','relative');
      slider.addClass('chocoslider');
      

      var kids = slider.children();
      kids.each(function() {
        var child = $(this);
        var link = '';
        if(!child.is('img')){
          if(child.is('a')){
            child.addClass('choco-imageLink');
            link = child;
          }
          child = child.find('img:first');
        }

                var childWidth = child.width();
                if(childWidth == 0) childWidth = child.attr('width');
                var childHeight = child.height();
                if(childHeight == 0) childHeight = child.attr('height');

                if(childWidth > slider.width()){
                    slider.width(childWidth);
                }
                if(childHeight > slider.height()){
                    slider.height(childHeight);
                }
                if(link != ''){
                    link.css('display','none');
                }
                child.css('display','none');
                vars.totalSlides++;
      });
      

      if($(kids[vars.currentSlide]).is('img')){
        vars.currentImage = $(kids[vars.currentSlide]);
      } else {
        vars.currentImage = $(kids[vars.currentSlide]).find('img:first');
      }
      

      if($(kids[vars.currentSlide]).is('a')){
        $(kids[vars.currentSlide]).css('display','block');
      }
      

      slider.css('background','url('+ vars.currentImage.attr('src') +') no-repeat');
      

      for(var i = 0; i < settings.numberStrips; i++){
        var sliceWidth = Math.round(slider.width()/settings.numberStrips);
        if(i == settings.numberStrips-1){
          slider.append(
            $('<div class="choco-slice"></div>').css({ left:(sliceWidth*i)+'px', width:(slider.width()-(sliceWidth*i))+'px' })
          );
        } else {
          slider.append(
            $('<div class="choco-slice"></div>').css({ left:(sliceWidth*i)+'px', width:sliceWidth+'px' })
          );
        }
      }
      

      slider.append(
        $('<div class="choco-title"><p></p></div>').css({ display:'none', opacity:settings.transparencytitle })
      );      

      if(vars.currentImage.attr('title') != ''){
                var title = vars.currentImage.attr('title');
                if(title.substr(0,1) == '#') title = $(title).html();
                $('.choco-title p', slider).html(title);          
        $('.choco-title', slider).fadeIn(settings.speedStrip);
      }
      

      var timer = 0;
      if(settings.auto && kids.length > 1){
        timer = setInterval(function(){ chocoRun(slider, kids, settings, false); }, settings.sliderDelay);
      }

      

      if(settings.controlNavigation){
        var chocoControl = $('<div class="choco-controlNavigation"></div>');
        slider.append(chocoControl);
        for(var i = 0; i < kids.length; i++){
            chocoControl.append('<a class="choco-control" rel="'+ i +'">'+ (i + 1) +'</a>');  
        }
        

        $('.choco-controlNavigation a:eq('+ vars.currentSlide +')', slider).addClass('active');
        
        $('.choco-controlNavigation a', slider).live('click', function(){
          if(vars.running) return false;
          if($(this).hasClass('active')) return false;
          clearInterval(timer);
          timer = '';
          slider.css('background','url('+ vars.currentImage.attr('src') +') no-repeat');
          vars.currentSlide = $(this).attr('rel') - 1;
          chocoRun(slider, kids, settings, 'control');
        });
      }
      

      if(settings.autoPause){
        slider.hover(function(){
          vars.paused = true;
          clearInterval(timer);
          timer = '';
        }, function(){
          vars.paused = false;

          if(timer == '' && settings.auto){
            timer = setInterval(function(){ chocoRun(slider, kids, settings, false); }, settings.sliderDelay);
          }
        });
      }
      

      slider.bind('choco:animFinished', function(){ 
        vars.running = false; 

        $(kids).each(function(){
          if($(this).is('a')){
            $(this).css('display','none');
          }
        });

        if($(kids[vars.currentSlide]).is('a')){
          $(kids[vars.currentSlide]).css('display','block');
        }

        if(timer == '' && !vars.paused && settings.auto){
          timer = setInterval(function(){ chocoRun(slider, kids, settings, false); }, settings.sliderDelay);
        }

        settings.aChange.call(this);
      });
    });
    
    function chocoRun(slider, kids, settings, nudge){

      var vars = slider.data('choco:vars');
      if((!vars || vars.stop) && !nudge) return false;
      

      settings.bChange.call(this);
          

      if(!nudge){
        slider.css('background','url('+ vars.currentImage.attr('src') +') no-repeat');
      } else {
        if(nudge == 'prev'){
          slider.css('background','url('+ vars.currentImage.attr('src') +') no-repeat');
        }
        if(nudge == 'next'){
          slider.css('background','url('+ vars.currentImage.attr('src') +') no-repeat');
        }
      }
      vars.currentSlide++;
      if(vars.currentSlide == vars.totalSlides){ 
        vars.currentSlide = 0;

        settings.chocoEnd.call(this);
      }
      if(vars.currentSlide < 0) vars.currentSlide = (vars.totalSlides - 1);

      if($(kids[vars.currentSlide]).is('img')){
        vars.currentImage = $(kids[vars.currentSlide]);
      } else {
        vars.currentImage = $(kids[vars.currentSlide]).find('img:first');
      }
      

      if(settings.controlNavigation){
        $('.choco-controlNavigation a', slider).removeClass('active');
        $('.choco-controlNavigation a:eq('+ vars.currentSlide +')', slider).addClass('active');
      }
      

      if(vars.currentImage.attr('title') != ''){
                var title = vars.currentImage.attr('title');
                if(title.substr(0,1) == '#') title = $(title).html(); 
                    
        if($('.choco-title', slider).css('display') == 'block'){
          $('.choco-title p', slider).fadeOut(settings.speedStrip, function(){
            $(this).html(title);
            $(this).fadeIn(settings.speedStrip);
          });
        } else {
          $('.choco-title p', slider).html(title);
        }         
        $('.choco-title', slider).fadeIn(settings.speedStrip);
      } else {
        $('.choco-title', slider).fadeOut(settings.speedStrip);
      }
      

      var  i = 0;
      $('.choco-slice', slider).each(function(){
        var sliceWidth = Math.round(slider.width()/settings.numberStrips);
        $(this).css({ height:'0px', opacity:'0', 
          background: 'url('+ vars.currentImage.attr('src') +') no-repeat -'+ ((sliceWidth + (i * sliceWidth)) - sliceWidth) +'px 0%' });
        i++;
      });
      
      if(settings.effect == 'random'){
        var anims = new Array("slide","fade");
        vars.randAnim = anims[Math.floor(Math.random()*(anims.length + 1))];
        if(vars.randAnim == undefined) vars.randAnim = 'fade';
      }
            

            if(settings.effect.indexOf(',') != -1){
                var anims = settings.effect.split(',');
                vars.randAnim = $.trim(anims[Math.floor(Math.random()*anims.length)]);
            }
    

      vars.running = true;
      if(settings.effect == 'slide' || vars.randAnim == 'slide'){
        var timeBuff = 0;
        var i = 0;
        $('.choco-slice', slider).each(function(){
          var slice = $(this);
          var origWidth = slice.width();
          slice.css({ top:'0px', height:'100%', width:'0px' });
          if(i == settings.numberStrips-1){
            setTimeout(function(){
              slice.animate({ width:origWidth, opacity:'1.0' }, settings.speedStrip, '', function(){ slider.trigger('choco:animFinished'); });
            }, (100 + timeBuff));
          } else {
            setTimeout(function(){
              slice.animate({ width:origWidth, opacity:'1.0' }, settings.speedStrip);
            }, (100 + timeBuff));
          }
          timeBuff += 50;
          i++;
        });
      }  
      else if(settings.effect == 'fade' || vars.randAnim == 'fade'){
        var i = 0;
        $('.choco-slice', slider).each(function(){
          $(this).css('height','100%');
          if(i == settings.numberStrips-1){
            $(this).animate({ opacity:'1.0' }, (settings.speedStrip*2), '', function(){ slider.trigger('choco:animFinished'); });
          } else {
            $(this).animate({ opacity:'1.0' }, (settings.speedStrip*2));
          }
          i++;
        });
      }
    }
  };
  

  $.fn.chocoslider.defaults = {
    auto:true,
    autoPause:true,   
    speedStrip:500,
    effect:'random',
    numberStrips:15,
    sliderDelay:3000,   
    transparencytitle:0.8,    
    bChange: function(){},
    aChange: function(){},
    chocoEnd: function(){},
    controlNavigation:true
  };
  
  $.fn._reverse = [].reverse;
  
})(jQuery);