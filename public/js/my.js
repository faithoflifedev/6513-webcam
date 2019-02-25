$(function() {
	console.log( 'Page loaded!' );
	init();
});

function init() 
{
	$.getJSON( 
		'/cams', 
		function( data ) 
		{
			console.log( data );
		}
	);

	var pageElements = {
		img: $( '#cam0' ),
		canvas: $( '#canvas0' ),
		video: $( '#vid0' )
	}

	//pageElements.video.loadeddata = firstVideoFrame

	//setColour( pageElements, track );
}

function track( pageElements )
{
	var slider = document.getElementById( 'tolerance' );

	//var tracker = new tracking.ColorTracker( 'dynamic' );

	pageElements.img.src = CONFIG.cameras.cam0;

	imageToCanvas( pageElements.img, pageElements.canvas, CONFIG.frameRate );

	canvasToVideo( pageElements.canvas, pageElements.video );

	/* tracking.ColorTracker.registerColor(
		'dynamic', 
		function( r, g, b )
		{
			return getColorDistance( color, {r: r, g: g, b: b} ) < slider.value
		}
	);

	tracker.on(
		'track', 
		function( e ) 
		{
			if ( e.data.length !== 0 )
			{
				e.data.forEach(
					function( rect ) 
					{
						console.log( rect );
					}
				);
			}
		}
	);

	tracking.track( pageElements.video, tracker ); */
}

function setColour( pageElements, callback )
{
	var img = document.createElement( 'IMG' );
	var colour = document.getElementById( 'color' );

	img.addEventListener(
		'load',
		function() {
			console.log( 'image loaded' );

			var vibrant = new Vibrant( img, 3, 3 );  console.log( vibrant );

//			var rgb = vibrant.MutedSwatch.rgb;

//			colour.style.backgroundColor = 'rgb( ' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ' )';

			callback( pageElements );
		}
	);

	img.style.display = 'none';

	img.src = document.getElementById( 'cam0' ).src;
}

function firstVideoFrame()
{
	conssole.log( 'video loaded' );
}

function getColorDistance( target, actual ) 
{
	return Math.sqrt(
		( target.r - actual.r ) * ( target.r - actual.r ) +
		( target.g - actual.g ) * ( target.g - actual.g ) +
		( target.b - actual.b ) * ( target.b - actual.b )
	);
}


//https://github.com/webrtc/samples/blob/gh-pages/src/content/capture/canvas-video/js/main.js - canvas to video
//https://developers.google.com/web/updates/2016/01/mediarecorder - record stream as webm

function imageToCanvas( img, canvas, frames )
{
	var ctx = canvas.getContext( '2d' );

	canvas.width = img.width;

	canvas.height = img.height;

	videopainttimerId = setInterval(
		function refreshCanvas() 
		{
			ctx.drawImage( img, 0, 0 );
		}, 
		1000 / self.framespersecond
	);
}

function canvasToVideo( canvas, video )
{
	var stream = canvas.captureStream();
	
	stream.onActive = function()
	{
		console.log( 'stream active' );
	}

	video.srcObject = stream; 

	var mediaTrack = stream.getVideoTracks()[0];
	
	console.log( mediaTrack.getSettings() );
}

