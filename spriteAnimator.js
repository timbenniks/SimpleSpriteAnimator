/**
 * requestAnimationFrame polyfill
 */
(function()
{
	var lastTime = 0,
		vendors = ['ms', 'moz', 'webkit', 'o'],
		x,
		length,
		currTime,
		timeToCall;

	for(x = 0, length = vendors.length; x < length && !window.requestAnimationFrame; ++x)
	{
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if(!window.requestAnimationFrame)
	{
		window.requestAnimationFrame = function(callback)
		{
			currTime = new Date().getTime();
			timeToCall = Math.max(0, 16 - (currTime - lastTime));
			lastTime = currTime + timeToCall;

			return window.setTimeout(function()
			{
				callback(currTime + timeToCall);

			}, timeToCall);
		};
	}

	if(!window.cancelAnimationFrame)
	{
		window.cancelAnimationFrame = function(id)
		{
			clearTimeout(id);
		};
	}
}());

/**
 * Animates the background position of a DOM node.
 * @param  {HTMLElement}   sprite   DOM node to animate the background for
 * @param  {Number}   step     The height of the frames in the sprite
 * @param  {Number}   duration Duration of the animation
 * @param  {Number}   start    The start position of the animation in pixels
 * @param  {Number}   end      The end position of the animation in pixels
 * @param  {Function} callback Callback function that fires when the animation is done
 */
window.animateSprite = function(sprite, step, duration, start, end, callback)
{
	var change = end - start,
		timestampStart = new Date().getTime(),

	anim = function(timestamp)
	{
		var progress = timestamp - timestampStart,
			ratio = ((progress < 0) ? 0 : progress) / duration,
			value = start + ((ratio < 1 ? ratio : 1) * change),
			pos = value - (value % step);

		sprite.style.backgroundPosition = '0 ' + pos + 'px';

		if(ratio < 1)
		{
			window.requestAnimationFrame(anim);
		}
		else if(callback && typeof callback === 'function')
		{
			callback();
		}
	};

	window.requestAnimationFrame(anim);
};