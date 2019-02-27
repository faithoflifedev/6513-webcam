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
            Util::csv_to_assoc( $csv )
        );
    }
);

$app->get(
    '/serve/{cams}',
    function( Request $request, Response $response, array $args )
    {
        $cams = $args['cams'];

        $contents = Util::createConfig( $cams );

        file_put_contents( 'ffserver.conf', $contents );

        $command = "ffserver -f ffserver.conf";

        $result = Util::shell( $command );

        return $response->withJson( 
                array(
                    'result' => $result,
                    'success' => true
                )
        );
    }
);

$app->get(
    '/cmd/{cmd}',
    function( Request $request, Response $response, array $args )
    {
        $cmd = $args['cmd'];

        $response->getBody()->write( '<pre>' . shell_exec( $cmd ) . '</pre>' );
    }
);

$app->run();