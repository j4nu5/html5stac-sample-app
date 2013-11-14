// jQuery TouchStac 1.0
//
// USAGE
// $(selector).touchstac(config);
//
// The wipe events should expect the result object with the following properties:
// speed - the wipe speed from 1 to 5
// x - how many pixels moved on the horizontal axis
// y - how many pixels moved on the vertical axis
//
// EXAMPLE
//		$(document).touchstac({
//			allowDiagonal: true,
//			wipeLeft: function(result) { alert("Left on speed " + result.speed) },
//			wipeTopLeft: function(result) { alert("Top left on speed " + result.speed) },
//			wipeBottomLeft: function(result) { alert("Bottom left on speed " + result.speed) }
//		});
//
//

(function($)
{
	$.fn.touchstac = function(settings)
	{
		// ------------------------------------------------------------------------
		// PLUGIN SETTINGS
		// ------------------------------------------------------------------------

		var config = {
            context:            undefined,
			// Variables and options
			moveX:				40,		// minimum amount of horizontal pixels to trigger a wipe event
			moveY:				40,		// minimum amount of vertical pixels to trigger a wipe event
			preventDefault:		true,	// if true, prevents default events (click for example)
			allowDiagonal:		false,	// if false, will trigger horizontal and vertical movements so
										// wipeTopLeft, wipeDownLeft, wipeTopRight, wipeDownRight are ignored
			tapToClick:			false,	// if user taps the screen it will fire a click event on the touched element

			// Wipe events
			wipeLeft:			false,	// called on wipe left gesture
			wipeRight:			false,	// called on wipe right gesture
			wipeUp:				false,	// called on wipe up gesture
			wipeDown:			false,	// called on wipe down gesture
			wipeUpLeft:			false,	// called on wipe top and left gesture
			wipeDownLeft:		false,	// called on wipe bottom and left gesture
			wipeUpRight:		false,	// called on wipe top and right gesture
			wipeDownRight:		false,	// called on wipe bottom and right gesture
			wipeMove:			false,	// triggered whenever touchMove acts
			wipeMoveCancel:		false,  // triggered when a move results in tap or cancelled by system
			wipeMoveEnd:		false,  // triggered everytime move ends irrespective of wipeUp/Left/Right/Down...

			wipeTopLeft:		false,	// DEPRECATED, USE WIPEUPLEFT
			wipeBottomLeft:		false,	// DEPRECATED, USE WIPEDOWNLEFT
			wipeTopRight:		false,	// DEPRECATED, USE WIPEUPRIGHT
			wipeBottomRight:	false,	// DEPRECATED, USE WIPEDOWNRIGHT
			
			// Gesture events
			gestureStart:		false,
			gestureChange:		false,
			gestureEnd:			false,
			wipeWithGesture:	false
		};

		if (settings)
		{
			$.extend(config, settings);
		}

		this.each(function()
		{
			// ------------------------------------------------------------------------
			// INTERNAL VARIABLES
			// ------------------------------------------------------------------------
			var startX = []; // where touch has started, left
			var startY = []; // where touch has started, top
			var startDate = false; // used to calculate timing and aprox. acceleration
			var curX = []; // keeps touch X position while moving on the screen
			var curY = []; // keeps touch Y position while moving on the screen
			var isMoving = false; // is user touching and moving?
			var touchedElement = false; // element which user has touched
			var fingersTouching = 0;
			var fingersTotal = 0;
			var isGesture = false;
			
			// these are for Windows Phone compatibility!
			var useMouseEvents = false; // force using the mouse events to simulate touch
			var clickEvent = false; // holds the click event of the target, when used hasn't clicked

			// ------------------------------------------------------------------------
			// TOUCH EVENTS
			// ------------------------------------------------------------------------

			// Called when user touches the screen
			function onTouchStart(e)
			{
				if (e.originalEvent.touches.length > 0)
				{
					if (config.preventDefault)
					{
						e.preventDefault();
					}

					// temporary fix for deprecated events, will be removed soon!!!
					if (config.allowDiagonal)
					{
						if (!config.wipeDownLeft) config.wipeDownLeft = config.wipeBottomLeft;
						if (!config.wipeDownRight) config.wipeDownRight = config.wipeBottomRight;
						if (!config.wipeUpLeft) config.wipeUpLeft = config.wipeTopLeft;
						if (!config.wipeUpRight) config.wipeUpRight = config.wipeTopRight;
					}
					startDate = new Date().getTime();
					if (!e.handling) {
						resetTouch();
					}
					for (var i=fingersTouching;i<e.originalEvent.touches.length; i++) {
						startX[i] = e.originalEvent.touches[i].pageX;
						startY[i] = e.originalEvent.touches[i].pageY;
						curX[i] = startX[i];
						curY[i] = startY[i];
						fingersTouching++;
						fingersTotal++;
					}
					isMoving = true;
					
					e.handling = true;

					touchedElement = $(e.originalEvent.target);
				}
			}
			
			function onGestureStart(e)
			{
				triggerEvent(config.gestureStart, {
					startX: startX,
					startY: startY,
					curX: curX,
					curY: curY,
					scale: e.originalEvent.scale,
					rotation: e.originalEvent.rotation
				}, e);
				if( !config.wipeWithGesture && (config.gestureStart || config.gestureChange || config.gestureEnd)) {
					isGesture = true;
					onTouchCancel(e);
				}
			}
			
			function onGestureEnd(e)
			{
				triggerEvent(config.gestureEnd, {
					startX: startX,
					startY: startY,
					curX: curX,
					curY: curY,
					scale: e.originalEvent.scale,
					rotation: e.originalEvent.rotation
				}, e);
			}
			
			function onGestureChange(e)
			{
				triggerEvent(config.gestureChange, {
					startX: startX,
					startY: startY,
					curX: curX,
					curY: curY,
					scale: e.originalEvent.scale,
					rotation: e.originalEvent.rotation
				}, e);
			}

			// Called when user untouches the screen
			function onTouchEnd(e)
			{
				fingersTouching = 0;
				if(!isGesture)
					touchCalculate(e);
			}
			
			function onTouchCancel(e)
			{
				triggerEvent(config.wipeMoveCancel, {
					startX: startX,
					startY: startY,
					curX: curX,
					curY: curY,
					scale: e.originalEvent.scale
				}, e);
				resetTouch();
			}

			// Called when user is touching and moving on the screen
			function onTouchMove(e)
			{
				if (config.preventDefault)
				{
					e.preventDefault();
				}

				if (isMoving)
				{
					if (useMouseEvents)
					{
						curX = e.originalEvent.pageX;
						curY = e.originalEvent.pageY;
					}
					else
					{
						var avgCurX = 0;
						var avgCurY = 0;
						for (i=0; i<e.originalEvent.touches.length; i++)
						{
							if (i == fingersTouching) 
							{
								startX[fingersTouching] = e.originalEvent.touches[i].pageX;
								startY[fingersTouching] = e.originalEvent.touches[i].pageY;
								fingersTotal++;
								fingersTouching++;
							}
							curX[i] = e.originalEvent.touches[i].pageX;
							curY[i] = e.originalEvent.touches[i].pageY;
							avgCurX += curX[i];
							avgCurY += curY[i];
						}
						avgCurX = Math.floor(avgCurX/e.originalEvent.touches.length);
						avgCurY = Math.floor(avgCurY/e.originalEvent.touches.length);
					}

					// if there's a wipeMove event, call it passing
					// current X and Y position (curX and curY)
					if (config.wipeMove && !isGesture)
					{
						triggerEvent(config.wipeMove, {
							curX: curX,
							curY: curY,
							startX: startX,
							startY: startY,
						}, e);
					}
				}
			}

			// ------------------------------------------------------------------------
			// CALCULATE TOUCH AND TRIGGER
			// ------------------------------------------------------------------------

			function touchCalculate(e)
			{
				var endDate = new Date().getTime();	// current date to calculate timing
				var ms = startDate - endDate; // duration of touch in milliseconds

				var dx = 0;
				var dy = 0;
				for (i=0;i<fingersTotal;i++) {
					var x = curX[i];			// current left position
					var y = curY[i];			// current top position
					dx += x - startX[i];	// diff of current left to starting left
					dy += y - startY[i];	// diff of current top to starting top
				}
				dx /= fingersTotal;
				dy /= fingersTotal;
				var ax = Math.abs(dx);	// amount of horizontal movement
				var ay = Math.abs(dy);	// amount of vertical movement
				// moved less than 15 pixels and touch duration less than 100ms,
				// if tapToClick is true then triggers a click and stop processing
				if (config.tapToClick && ax < 15 && ay < 15 && ms < 100 && fingersTotal == 1)
				{
					onTouchCancel(e);
					resetTouch();
					if ( touchedElement.context.nodeName == "#text") {
						touchedElement.parent().trigger("tap");
					} else {
						touchedElement.trigger("tap");
					}
					return;
				}

				var toright = dx > 0;	// if true X movement is to the right, if false is to the left
				var tobottom = dy > 0;	// if true Y movement is to the bottom, if false is to the top

				// calculate speed from 1 to 5, being 1 slower and 5 faster
				var s = ((ax + ay) * 60) / ((ms) / 6 * (ms));

				if (s < 1) s = 1;
				if (s > 5) s = 5;

				var result = {
						speed: parseInt(s), 
						x: ax, 
						y: ay, 
						startX: startX,
						startY: startY,
						curX: curX,
						curY: curY,
					};

				if (ax >= config.moveX)
				{
					// check if it's allowed and call diagonal wipe events
					if (config.allowDiagonal && ay >= config.moveY)
					{
						if (toright && tobottom)
						{
							triggerEvent(config.wipeDownRight, result, e);
						}
						else if (toright && !tobottom)
						{
							triggerEvent(config.wipeUpRight, result, e);
						}
						else if (!toright && tobottom)
						{
							triggerEvent(config.wipeDownLeft, result, e);
						}
						else
						{
							triggerEvent(config.wipeUpLeft, result, e);
						}
					}
					else if (ax >= ay)
					{
						if (toright)
						{
							triggerEvent(config.wipeRight, result, e);
						}
						else
						{
							triggerEvent(config.wipeLeft, result, e);
						}
					}
				}

				if (ay >= config.moveY && ay > ax)
				{
					if (tobottom)
					{
						triggerEvent(config.wipeDown, result, e);
					}
					else
					{
						triggerEvent(config.wipeUp, result, e);
					}
				}
				
				triggerEvent(config.wipeMoveEnd, result, e);

				if (config.preventDefault)
				{
					e.preventDefault();
					//e.stopPropagation();
				}

				resetTouch();
			}

			// Resets the cached variables
			function resetTouch()
			{
				startX = [];
				startY = [];
				startDate = false;
				isMoving = false;
				isGesture = false;
				curX = [];
				curY = [];
				fingersTotal = 0;
				fingersTouching = 0;
			}

			// Triggers a wipe event passing a result object with
			// speed from 1 to 5, and x / y movement amount in pixels
			function triggerEvent(wipeEvent, result, event)
			{
				if (wipeEvent) {
					wipeEvent(result, event, config.context);
				}
			}

			// ------------------------------------------------------------------------
			// ADD TOUCHSTART AND TOUCHEND EVENT LISTENERS
			// ------------------------------------------------------------------------

			if ('ontouchstart' in document.documentElement)
			{
				$(this).off('touchstart', this);
				$(this).off('touchend', this);
				$(this).off('touchcancel', this);
				$(this).off('touchmove', this);
				$(this).off('gesturestart', this);
				$(this).off('gestureend', this);
				$(this).off('gesturechange', this);
				$(this).on('touchstart', this, onTouchStart);
				$(this).on('touchend', this, onTouchEnd);
				$(this).on('touchcancel', this, onTouchCancel);
				$(this).on('touchmove', this, onTouchMove);
				$(this).on('gesturestart', this, onGestureStart);
				$(this).on('gestureend', this, onGestureEnd);
				$(this).on('gesturechange', this, onGestureChange);
			}
			
		});

		return this;
	};
})(jQuery);
