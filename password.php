<?php 
error_reporting(0);
include'connect.inc.php';

 
            $user = mysqli_real_escape_string($conn,$_POST['username']);
            $pass = md5($_POST['pass']);
            $query = mysqli_query($conn,"SELECT * FROM users WHERE username='$user' AND password='$pass'");
            $numrows=mysqli_num_rows($query);
            echo $numrows;

 ?>