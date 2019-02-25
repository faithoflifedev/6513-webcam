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
}