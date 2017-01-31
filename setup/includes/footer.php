
<script>
    var isAccount = false;
<?php
    if (User::isLoggedIn()) {
    ?>
    isAccount = true;
    <?php
    }
 ?>
</script>

<script src="/js/dist/app.min.js"></script>
    <?php
    if (AppBootstrap::getDatabaseZone() == AppBootstrap::ZONE_LOCAL && preg_match('!/(john)/!i', getcwd())) {
        ?>
        <script src="//localhost:35729/livereload.js"></script>
        <?php
    }
    ?>

<?php
