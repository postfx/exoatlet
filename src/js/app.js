jQuery(document).ready(function ($) {

	if ($('.wrapper').hasClass('page-main')) {
		function sectHeight() {
			if (window.matchMedia("(min-width: 1025px)").matches) {
				var h = $(window).outerHeight();
				$('.section-start').css({
					height: h
				});
			} else {
				$('.section-start').css({
					height: 'auto'
				});
			}
			/*var hCircle = $('.corner-circle').width();
		$('.corner-circle').css({height: hCircle});*/
		}

		sectHeight();
		$(window).on('resize', sectHeight);

		//ПЕРЕХОДЫ
		if (window.matchMedia("(min-width: 1025px)").matches) {
			var pinHome = document.getElementById('pinHome');

			var controller = new ScrollMagic.Controller();

			var sceneStart = new ScrollMagic.Scene({
					triggerElement: '.section-start',
					triggerHook: 'onLeave',
				})
				.setPin('.section-start').addTo(controller);

			/*$(window).on('scroll', function() {
			if ($(window).scrollTop() >= $('.section-for-home').offset().top) {
				$('.section-start').css({position: 'relative'});
			}
			else {
				$('.section-start').css({position: 'fixed'});
			}
		});*/

			var sceneHome = new ScrollMagic.Scene({
					triggerElement: '#triggerHome',
					triggerHook: 'onLeave'
				})
				.setPin(pinHome).addTo(controller);

			var sceneHospital = new ScrollMagic.Scene({
					triggerElement: '.section-pilots',
					triggerHook: 'onEnter'
				})
				.setPin('.section-for-hospital').addTo(controller);

			var sceneNumberAppear = new ScrollMagic.Scene({
					triggerElement: ".section-pilots",
					duration: 200,
					triggerHook: 0.4,
					reverse: false
				})
				.addTo(controller)
				.on("progress", function (e) {
					var opacity = e.progress.toFixed(2);
					if (opacity >= 1) {
						opacity = 1;
					}
					$("#tweenNumber").css({
						opacity: opacity
					});
				})
				.on("leave", function (e) {
					$(".section-pilots .section-title").animate({
						marginLeft: 0
					}, "slow", function () {
						setTimeout(function () {
							$('.container-descr').animate({
								left: 0
							});
						}, 500);
					});
				});

			var sceneNumberScale = new ScrollMagic.Scene({
					triggerElement: "#triggerScale",
					duration: $('.section-numbers').offset().top - $('#triggerScale').offset().top,
					triggerHook: 0.2,
					reverse: true
				})
				.addTo(controller)
				.on("enter", function (e) {
					$('.section-pilots .sect-overlay').fadeIn();
					$('.section-numbers .container').css({
						opacity: 0
					});
				})
				.on("progress", function (e) {
					var bgOp = e.progress.toFixed(3);
					var scale = e.progress.toFixed(3) * 10;
					var dir = e.target.controller().info("scrollDirection");
					if (scale <= 1) {
						scale = 1;
					}
					$("#tweenNumber").css({
						transform: 'scale(' + scale + ')'
					});
					$('.section-pilots .sect-overlay, .section-numbers .sect-inner').css({
						backgroundColor: 'rgba(0, 174, 239, ' + bgOp + ')'
					});
					$('.section-numbers .container').css({
						opacity: bgOp
					});
				});
		}

		/*if (window.matchMedia("(max-width: 1024px)").matches) {
		controller.enabled(false);
	}*/

		//ИНДИКАЦИЯ ШАГОВ
		/*$(window).on('scroll', function () {
					var $steps = $('.container-screen-steps'),
						posTopSteps = $steps.offset().top;

					$('.section').each(function () {
				var sectTop = $(this).offset().top;
				var num = ($(this).index()) - 1;
				if (posTopSteps >= sectTop) {
					$steps.find('p').eq(num).addClass('filled');
					if ($(this).hasClass('dark-bg')) {
						$steps.removeClass('black black-white');
					} else if ($(this).hasClass('light-bg')) {
						$steps.addClass('black');
						$steps.removeClass('white black-white');
					} else if ($(this).hasClass('blue-bg')) {
						$steps.addClass('black-white');
						$steps.removeClass('black white');
					} else if ($(this).hasClass('section-start')) {
						$steps.removeClass('black black-white');
					} else if ($(this).hasClass('section-for-hospital')) {
						$steps.removeClass('black black-white');
					}
				} else {
					$steps.find('p').eq(num).removeClass('filled');
				}
			});
			if (posTopSteps >= $('.section-for-hospital').offset().top) {
				$steps.find('p').eq(2).addClass('filled');
			} else {
				$steps.find('p').eq(2).removeClass('filled');
			}
			if (posTopSteps >= $('footer').offset().top) {
				$steps.css({
					opacity: 0
				});
			} else {
				$steps.css({
					opacity: 1
				});
			}
		});*/

		//НАБОР ТЕКСТА НА ГЛАВНОЙ
		$('#containerDescrTyped').typed({
			stringsElement: $('#typed-text'),
			showCursor: false,
			callback: function () {
				$('#containerDescrTyped').prepend($('.link-in-typed'));
			}
		});

		//ВКЛЮЧЕНИЕ ВИДЕО
		$('.section-start .btn-play').on('click', function () {
			// $('.corner-circle').animate({width: '10000px', height: '10000px'});
			$('.corner-circle').addClass('clicked');
			setTimeout(function () {
				$('.container-start').hide();
				$('.container-start-video').show();
				document.getElementById('startVideo').play();
			}, 1000);
		});

		//ДВИЖЕНИЕ ИЗОБРАЖЕНИЙ В СЕКЦИИ ДЛЯ ДОМА
		function containerW(o, l) {
			var l = 0;
			o.children().each(function () {
				l += $(this).outerWidth(true);
			});
			return l;
		}
		$(window).on('resize', function () {
			var movedW = containerW($('.container-moved'));
			$('.container-moved').css('width', movedW);
		});
		var slidesQuant = $('.container-moved').children().length;
		$('.container-slide-numbers .all span').text(slidesQuant);
		var movedW = containerW($('.container-moved'));
		$('.container-moved').css('width', movedW);
		var act = true;

		$(window).on('scroll', function () {
			var posMovedTop = $('.section-for-home .container-moved').offset().top - $(window).outerHeight() * 0.45,
				posMovedBottom = posMovedTop + 300;
			screenPos = $(window).scrollTop();
			if (screenPos >= posMovedTop & screenPos <= posMovedBottom & act) {

				var activatorL = true,
					activatorR = true;
				$(window).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function (event) {

					var delta = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail),
						$moved = $('.section-for-home .container-moved'),
						step = 300,
						movedLeft = parseInt($moved.css('marginLeft'));
					if (screenPos >= posMovedTop) {
						event.preventDefault();

						if (delta >= 0 & activatorR) {
							movedLeft += step;
							if (movedLeft >= $(window).outerWidth()) {
								movedLeft = $(window).outerWidth();
								activatorR = false;
								$(window).unbind('mousewheel DOMMouseScroll MozMousePixelScroll');
							}
							$moved.css('marginLeft', movedLeft);
							activatorL = true;
						} else if (delta < 0 & activatorL) {
							movedLeft -= step;
							// if (movedLeft <= $('.container').offset().left) {
							if (($moved.offset().left + $moved.outerWidth() - step) <= $(window).outerWidth()) {
								/*movedLeft = $('.container').offset().left;
					  		activatorL = false;*/
								movedLeft = $(window).outerWidth() - $moved.outerWidth();
								activatorL = false;
								act = false;
								if (delta < 0) {
									$(window).unbind('mousewheel DOMMouseScroll MozMousePixelScroll');
								}
							}
							if ($(window).outerWidth() > movedLeft) {
								$('#movedRight').addClass('visible-arr');
							}
							$moved.css('marginLeft', movedLeft);
							activatorR = true;
						}

						var wImg = $('.container-moved').children().first().outerWidth(true),
							visible = $(window).width() - movedLeft,
							act2 = true;
						$('.container-moved').children().each(function () {

							if (visible <= wImg & act2) {
								slideNum = $(this).index() + 1;
								if (visible <= 3) {
									slideNum = 3;
								}
								act2 = false;
							} else if (act2) {
								wImg += $(this).outerWidth(true);
							}
						});
						$('#slControlsHome .current').text(slideNum);
					}
				});
			}
		});

		$('#movedLeft').on('click', function () {
			var visible = $(window).width() - parseInt($('.section-for-home .container-moved').css('marginLeft')),
				wImg = $('.container-moved').children().first().outerWidth(true),
				activatorArrL = true,
				mov = 0,
				marg = 0,
				slideNum = 0;
			$('.container-moved').children().each(function () {
				if (wImg > visible & activatorArrL) {
					mov = wImg - visible;
					marg = parseInt($('.container-moved').css('marginLeft')) - mov;
					activatorArrL = false;
					// console.log($(this).index());
					if ($(this).index() == 0) {
						$('#movedRight').addClass('visible-arr');
					}
					slideNum = $(this).index() + 1;
				} else {
					wImg += $(this).outerWidth(true);
				}
			});
			if (($('.container-moved').offset().left - mov + $('.container-moved').outerWidth()) <= $(window).outerWidth()) {
				marg -= $('.container-moved').offset().left + $('.container-moved').outerWidth() - $(window).outerWidth() - mov;
			}
			$('.container-moved').css('marginLeft', marg);
			$('#slControlsHome .current').text(slideNum);
		});
		$('#movedRight').on('click', function () {
			var visible = $(window).width() - parseInt($('.section-for-home .container-moved').css('marginLeft')),
				wImg = $('.container-moved').children().first().outerWidth(true),
				activatorArrR = true,
				marg = 0,
				slideNum = 0;
			$('.container-moved').children().each(function () {
				if (wImg > visible & activatorArrR) {
					var mov = $(this).outerWidth(true) - (wImg - visible);
					if (mov == 0) {
						mov = $(this).outerWidth(true);
						slideNum = $(this).index() - 1;
						if (slideNum < 0) {
							slideNum = 0;
						}
					} else {
						slideNum = $(this).index();
					}
					marg = parseInt($('.container-moved').css('marginLeft')) + mov;
					activatorArrR = false;

				} else {
					wImg += $(this).outerWidth(true);
				}
			});
			$('.container-moved').css('marginLeft', marg);
			$('#slControlsHome .current').text(slideNum);
		});
	}

	//СЛАЙДЕРЫ
	$('.slick-home').slick({
		slidesToShow: 2,
		mobileFirst: true,
		// variableWidth: true,
		appendArrows: $('#slControlsHome'),
		prevArrow: $('#movedLeft'),
		nextArrow: $('#movedRight')
	});
	$('.slick-hospital').slick({
		slidesToShow: 3,
		variableWidth: true,
		infinite: false,
		appendArrows: $('#slControlsHospital'),
		prevArrow: $('#slLeftHospital'),
		nextArrow: $('#slRightHospital')
	});
	var quantHospSlides = $('.slick-hospital .slick-slide[role = option]').length;
	$('#slControlsHospital .all span').text(quantHospSlides);
	$('.slick-hospital').on('afterChange', function (currentSlide) {
		var currentSlide = $('.slick-hospital').slick('slickCurrentSlide') + 1;
		$('#slControlsHospital .current').text(currentSlide);
	});

	//ФОРМЫ ВХОДА
	$('.switch-enter a, #footerEnter').on('click', function () {
		$('body').addClass('modal__opened').prepend('<div class="overlay"></div>');
		$('.container-enter').fadeIn();
	});
	$('.mob-enter a').on('click', function () {
		$('body').prepend('<div class="overlay"></div>');
		// $('.container-top-menu').toggleClass('opened');
		$('.container-enter').fadeIn();
	});
	$('.container-enter .close-form').on('click', function () {

		if ($('.container-top-menu').hasClass('opened')) {
			$('.container-top-menu').removeClass('opened');
		}
		$(this).parents('.container-enter').fadeOut();
		$('body .overlay').remove();
	});

	$('.container-switches a').on('click', function () {
		$(this).parents('.container-enter').addClass('container-bg');
		$('.tab-content .tab-pane').find('.container-forgotten-passw').hide();
		$('.tab-content .tab-pane').find('.container-enter-form').show();
	});
	$('.container-enter .form-control').on('focusin', function () {
		$(this).parents('.form-group').toggleClass('current');
	});
	$('.container-enter .form-control').on('focusout', function () {
		$(this).parents('.form-group').toggleClass('current');
	});
	$('.forgotten-passw').on('click', function () {
		$(this).parents('.container-enter-form').hide().siblings('.container-forgotten-passw').show();
	});
	$('.link-registr').on('click', function () {
		$(this).parents('.container-inner').children().not('.close-form').hide();
		$('.container-registr-form').show();
	});
	$('.link-back').on('click', function () {
		$('.container-enter .container-inner').children().show();
		$('.container-registr-form').hide();
	});


	$('.btn-mob-menu, .close-mob-menu').on('click', function () {

		if ($(this).parent().hasClass('container-btn-menu-form')) {
			$('.container-enter:first').fadeOut();
			$('body .overlay').remove();
		} else {
			$('.container-top-menu').toggleClass('opened');
		}
	});
});