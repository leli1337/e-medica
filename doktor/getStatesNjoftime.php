<?php 
	include'connect.inc.php';
	session_start();
	$doktor = mysqli_real_escape_string($conn,$_SESSION['sess_user']);
	$partialStates = mysqli_real_escape_string($conn,$_POST['partialState']);
	if(substr($partialStates,0,strpos($partialStates, " "))){
	$emri=substr($partialStates,0,strpos($partialStates, " "));
	$mbiemri = substr($partialStates,(strpos($partialStates, " ")+1));
}else{
	$emri =$partialStates ;
	$mbiemri = "";
}
	
	$states = mysqli_query($conn,"SELECT * FROM users WHERE Emri LIKE '$emri%'  AND Mbiemri LIKE '%$mbiemri%' AND doktori_familjes='$doktor' ");
	
if(!empty($partialStates)){
		while($state = mysqli_fetch_array($states)){
			?>
			
			<div id="<?php echo $state['username']; ?>" class="njoftime_pacient">
				<div class="user_name_njoftime">
					<?php 
					echo $state['Emri']." ".$state['Mbiemri']; 
					?>
				</div>
			</div>
			
		<?php	
		}
	}


