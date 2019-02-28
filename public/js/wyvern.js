$(function() {
	console.log( 'Page loaded!' );

	page.init();
});

const page = {
	init: async function () 
	{
		let tmpl = $.templates( '#vidButton' );

		let arr_cams = [];

		console.log( 'getting available cameras' );

		let remote_cams = await this.getRemoteCams();

		if ( remote_cams.length != 0  )
		{
			$.each(
				remote_cams,
				function( index, value )
				{
					$( 'div.button_remote' ).html( tmpl.render( {name: value[0]} ) ); 
				}
			);
		}

		let local_cams = await this.getLocalCams();

		if ( local_cams.length != 0 )
		{
			$.each(
				local_cams,
				function( index, value )
				{
					$( 'div.button_local' ).html( tmpl.render( {name: value[0]} ) ); 
				}
			);
		}

		$( 'div.vidCanvas' ).on(
			'dragover',
			function( event ) {
				event.preventDefault();

				console.log( 'dover' );
			}
		)

		$( 'div.vidCanvas' ).on(
			'drop',
			function( event ) {
				event.preventDefault();

				let tmpl = $.templates( '#vidCanvas' );

				let $container = $( this ).parent();

				let vid_count = $container.children().length; 
				console.log( vid_count );

				if ( $( this ).attr( 'data-type' ) == 'empty' )
				{
					$container.prepend( 
						tmpl.render({ element: '<img class="snow" src="/cameras/snow.mjpeg" />' })
					); 
				}
			}
		);



	},
	getRemoteCams: async function()
	{
		let result;

		try{
			result = $.getJSON( '/cams' );

			return result;
		}
		catch( error ) {
			console.log( 'error getting remote cams' );
		
			return [];
		};
	},
	getLocalCams: async function( callback )
	{
		let result = [];

		let md = navigator.mediaDevices;

		if ( !md || !md.enumerateDevices ) 
			return null;

		let devices = await md.enumerateDevices();

		devices.some( 
			function( device )
			{
				let inc = 0;

				if ( device.kind === 'videoinput' )
				{
					result.push( ['Local WebCam:' + inc, '/local/' + device.deviceId] );
				}
			}
		);

		return result;
	}
};