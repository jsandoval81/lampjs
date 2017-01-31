<?php
require_once rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/framework/local/localBootstrap.php';

$head = new HTMLHeadCustomer();
$head->display();
?>

<body>
    <div class="app">
        <?php include(AppBootstrap::getSiteRoot() . '/includes/loading.php'); ?>
    </div>

<?php require(AppBootstrap::getSiteRoot() . '/includes/footer.php'); ?>
</body>
</html>
