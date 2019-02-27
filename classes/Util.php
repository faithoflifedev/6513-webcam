<?php
/**
 * Converts CSV to multi dimensional array
 */
class Util
{
	public static function csv_to_assoc( $content )
	{

		$arr_result = array();

		$arr_lines = explode( "\n", $content );

		foreach ( $arr_lines as $line ):
			if ( $line != "" )
				$arr_result[] = str_getcsv( $line );
		endforeach;

		return $arr_result;
	}

	public static function createConfig( $count ) {
		$config = file_get_contents( '../bash/ffserver.conf' );

		for ( $i = 0; $i < $count; $i++ ):
			$config .= <<< STREAM
				<Feed cam${i}.ffm>
					File /data/cam${i}.ffm
					FileMaxSize 5M
				</Feed>
				
				#stream for cam0.ffm
				<Stream cam${i}.mjpeg>
					Feed cam${i}.ffm
					Format mpjpeg
					
					VideoFrameRate 25
					VideoSize 640x480
					VideoBitRate 1024
					VideoIntraOnly
					
					Preroll 0
					StartSendOnKey
					NoAudio
					Strict -1
				</Stream>
				
STREAM;
		endfor;

		return $config;
	}

	public static function shell( $command )
	{
		$pipes = array();

		$output = null;

		$error = null;

		$process = proc_open(
		  $command,
		  array(
			 0 => array( 'pipe', 'r' ),
			 1 => array( 'pipe', 'w' ),
			 2 => array( 'pipe', 'w' ),
		  ),
		  $pipes
		);
		
		stream_set_blocking( $pipes[1], true );
		stream_set_blocking( $pipes[2], true );
		
		if ( is_resource( $process ) ) 
		{
			$output = stream_get_contents( $pipes[1] );
			$error = stream_get_contents( $pipes[2] );
		
		  	fclose( $pipes[1] );
		  	fclose( $pipes[2] );
		
		  	proc_close( $process );		
		}

		return array(
			'output' => $output,
			'error' => $error
		);
	}
}