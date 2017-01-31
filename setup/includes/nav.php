<header>
    <div class="headerwrap">
        <a href="/"><div id="cleanse_logo"></div></a>

        <?php
        if (User::isLoggedIn()) {
            $permsAdmin = HTMLHeadAdmin::hasAccess(array(Permission::PERMISSION_ADMIN_LOGIN));
            ?>
            <nav>
                <ul>
                <?php
                if ($permsAdmin) {
                    ?>
                    <li <?php echo preg_match('!/Admin/Access/.*?!i', $_SERVER['REQUEST_URI']) ? 'class="current"' : '';?>><a href="/Admin/Access/" class="frontpage"><span>Users</span></a></li>
                    <?php
                }
                ?>
                <li <?php echo preg_match('!/Account/.*?!i', $_SERVER['REQUEST_URI']) ? 'class="current"' : '';?>><a href="/Account/" class="frontpage"><span>My Account</span></a></li>
                <?php
                if ($permsAdmin && AppBootstrap::getDatabaseZone() != AppBootstrap::ZONE_PROD) {
                    ?>
                    <li <?php echo preg_match('!/Admin/Reset/.*?!i', $_SERVER['REQUEST_URI']) ? 'class="current"' : '';?>><a href="/Admin/Reset/" class="frontpage"><span>Reset DB</span></a></li>
                    <?php
                }
                ?>
                <li <?php echo preg_match('!/Logout/.*?!i', $_SERVER['REQUEST_URI']) ? 'class="current"' : '';?>><a href="/Logout/" class="frontpage"><span>Logout</span></a></li>
                </ul>
            </nav>
            <?php
        } else {
            if (preg_match('!/ResetPassword/Set/!i', $_SERVER['REQUEST_URI'])) {
                ?>
                <nav>
                    <ul>
                    <li><a href="/Login/"><span>Login</span></a></li>
                    </ul>
                </nav>
                <?php
            } else {
                ?>
                <div id="loginBox">
                    <a href="#" id="loginClose"><span>X</span></a>
                    <a href="/ResetPassword/" class="forgotpass"><span>Forgot Password?</span></a>
                    <form id="loginForm" action="/Login/" method="post">
                        <input name="username" type="text" autocomplete="off" placeholder="Username" />
                        <input name="password" type="password" autocomplete="off" placeholder="Password" />
                        <input type="submit" class="login" name="login" value="Login" />
                    </form>
                    <div class="clearFix"></div>
                </div>
                <nav>
                    <ul>
                    <li><a href="#" id="loginButton"><span>Login</span></a></li>
                    </ul>
                </nav>
                <?php
            }
        }
        ?>
    </div>
    <div class="clear"></div>
</header>
