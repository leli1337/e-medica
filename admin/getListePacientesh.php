<?php 
include 'connect.inc.php';
$doktori_familjes = mysqli_real_escape_string($conn,$_SESSION['sess_user']);
if(isset($_SESSION["sess_user"])){
$query = mysqli_query($conn,"SELECT * FROM users WHERE kategoria='pacient'");
if($query === FALSE) { 
    die(mysqli_error()); }
    echo "<table border='1'>";
while($extract = mysqli_fetch_array($query)){
	$emri = $extract['Emri'];
	$mbiemri = $extract['Mbiemri'];
	$id = $extract['username'];
?>
	<tr> 

	<td> <?php echo $emri." ".$mbiemri;?></td>
	<td>
	<form action='modifikoPassword.php' method='POST'> 
	<input type='hidden' value=<?php echo $id; ?> name='modifiko'/>
	</td>
	<td><input type='submit' id='submit' name='submit' value='Ndrysho Password'></form></td>
	
	
	</tr>
		
		<?php				
						}

						echo "</table>";
}



 ?>