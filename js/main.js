$(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('.yr').text(new Date().getFullYear());
  var $h=$('#hdr'),$t=$('.totop'),$pb=$('#pbar'),els=$('[data-speed]').toArray(),vh=window.innerHeight,tick=false;
  function frame(){
    tick=false;var y=window.scrollY,max=document.documentElement.scrollHeight-vh;
    $h.toggleClass('scrolled',y>40);$t.toggleClass('show',y>600);$pb.css('width',(max>0?y/max*100:0)+'%');
    if(!reduce){els.forEach(function(el){var p=el.parentElement.getBoundingClientRect();if(p.bottom<-200||p.top>vh+200)return;
      var c=p.top+p.height/2-vh/2;el.style.setProperty('--py',(-c*parseFloat(el.getAttribute('data-speed'))).toFixed(1));});}
  }
  function req(){if(!tick){tick=true;requestAnimationFrame(frame);}}
  $(window).on('scroll resize',function(){vh=window.innerHeight;req();});frame();
  $t.on('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  $('#printProfile').on('click',function(){window.print();});
  // mouse depth on hero
  var $s=$('.scene');
  if($s.length&&!reduce&&window.matchMedia('(hover:hover)').matches){
    $('.hero').on('mousemove',function(e){var r=this.getBoundingClientRect();
      $s[0].style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));$s[0].style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3));});
  }
  // reveal
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){$(e.target).addClass('in');io.unobserve(e.target);}});},{threshold:.1});
    $('.rv').each(function(){io.observe(this);});
    // counters
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);
      var $e=$(e.target),n=+$e.data('count'),s=Date.now();(function step(){var k=Math.min(1,(Date.now()-s)/1400);$e.text(Math.round(n*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(step);})();});},{threshold:.5});
    $('[data-count]').each(function(){co.observe(this);});
    // journey
    var steps=$('.jstep');
    if(steps.length){
      var names=steps.map(function(){return $(this).find('h3').text();}).get();
      function setStep(i){steps.removeClass('active').eq(i).addClass('active');
        $('#rp').css('stroke-dashoffset',1-i/5);
        $('.nd').each(function(){var k=+$(this).data('i');$(this).toggleClass('on',k<=i).toggleClass('cur',k===i);});
        $('#jn').text(i+1);$('#jt').text(names[i]);}
      setStep(0);
      var jo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setStep(+$(e.target).data('i'));});},{rootMargin:'-42% 0px -42% 0px'});
      steps.each(function(){jo.observe(this);});
    }
  }else{$('.rv').addClass('in');$('[data-count]').each(function(){$(this).text($(this).data('count'));});}
  // Forms: validate in the browser, then send to the PHP endpoint.
  $('form.enq').each(function(){
    var $form=$(this);
    $form.find('input[id],select[id],textarea[id]').each(function(){
      if(!this.name && this.id) this.name=this.id;
    });
    if(!$form.find('.form-status').length){$form.append('<div class="alert d-none form-status" role="status" aria-live="polite"></div>');}
  }).on('submit',function(e){
    e.preventDefault();var form=this,$f=$(form),ok=true;
    $f.find('[required]').each(function(){
      var v=$.trim($(this).val()),bad=!v||(this.type==='email'&&!/^\S+@\S+\.\S+$/.test(v));
      $(this).toggleClass('is-invalid',bad);if(bad)ok=false;
    });
    if(!ok){$f.find('.is-invalid').first().trigger('focus');return;}
    var $button=$f.find('button[type="submit"]').first(),label=$button.text();
    $button.prop('disabled',true).text('Sending…');
    var $status=$f.find('.form-status').removeClass('d-none alert-success alert-danger').text('');
    fetch($f.attr('action')||'submit-enquiry.php',{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
      .then(function(r){return r.json().then(function(data){if(!r.ok||!data.success)throw new Error(data.message||'We could not send your enquiry. Please try again.');return data;});})
      .then(function(data){$status.addClass('alert-success').text(data.message||'Thank you. Your enquiry has been received.');form.reset();$f.find('.is-invalid').removeClass('is-invalid');})
      .catch(function(err){$status.addClass('alert-danger').text(err.message||'Something went wrong. Please try again.');})
      .finally(function(){$button.prop('disabled',false).text(label);});
  });
});

/* advanced motion: 3D tilt, magnetic buttons, spotlight */
$(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!window.matchMedia('(hover:hover)').matches)return;
  $('.card-x,.fw,.who,.mv,.obj').on('mousemove',function(e){
    var r=this.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    this.style.setProperty('--ry',(x*10).toFixed(2)+'deg');this.style.setProperty('--rx',(-y*8).toFixed(2)+'deg');
  }).on('mouseleave',function(){this.style.setProperty('--rx','0deg');this.style.setProperty('--ry','0deg');});
  $('.btn-gold,.btn-ghost,.btn-blue').on('mousemove',function(e){
    var r=this.getBoundingClientRect();
    this.style.setProperty('--tx',((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px');
    this.style.setProperty('--ty',((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px');
  }).on('mouseleave',function(){this.style.setProperty('--tx','0px');this.style.setProperty('--ty','0px');});
  $('.sec.dark').on('mousemove',function(e){
    var r=this.getBoundingClientRect();
    this.style.setProperty('--sx',(e.clientX-r.left)+'px');this.style.setProperty('--sy',(e.clientY-r.top)+'px');
  });
});
