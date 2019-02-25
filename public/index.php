<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';

require '../classes/Util.php';

$app = new \Slim\App;

$container = $app->getContainer();

$container['view'] = new \Slim\Views\PhpRenderer( '../templates/' );

$app->get( 
    '/', 
    function( Request $request, Response $response, array $args )
    {
        
        $my_response = $this->view->render( 
            $response, 
            'wyvern.phtml', 
            ['server' => $_SERVER] 
        );

        return $my_response;
    }
);

//ajax
$app->get(
    '/cams',
    function( Request $request, Response $response, array $args )
    {
	$csv = shell_exec( 'bash ../bash/enumerate_webcams.sh' );

	return $response->withJson( 
		json_encode( Util::csv_to_assoc( $csv ) )
	);
    }
);

$app->run();
