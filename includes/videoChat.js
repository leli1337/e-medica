function openVideoChat() {
	$.post("checkOnline.php",function(e){
		var e = JSON.parse(e);
		console.log(e);
	if (e[0]==1) {
			$("body").attr("style","overflow:hidden");
			var text = '<div id="videoChatDiv"><video id="localVideo"></video><div id="remotes"></div></div>';
				$('body').append(text);
				 document.getElementById("videoChatDiv").addEventListener('click',function(){
    	$("videoChatDiv").remove();
    });
			  var webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                localVideoEl: 'localVideo',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: '',
                // immediately ask for camera access
                autoRequestMedia: true,
                debug: false,
                detectSpeakingEvents: true,
                autoAdjustMic: false
            });

            // when it's ready, join if we got a room from the URL
            webrtc.on('readyToCall', function () {
                // you can name it anything
                if (e[1]) webrtc.joinRoom(e[1]);
            });

            

            // we got access to the camera
            webrtc.on('localStream', function (stream) {
                var button = document.querySelector('form>button');
                if (button) button.removeAttribute('disabled');
                $('#localVolume').show();
            });
            // we did not get access to the camera
            webrtc.on('localMediaError', function (err) {
            });

            // local screen obtained
            webrtc.on('localScreenAdded', function (video) {
                video.onclick = function () {
                    video.style.width = video.videoWidth + 'px';
                    video.style.height = video.videoHeight + 'px';
                };
                document.getElementById('localScreenContainer').appendChild(video);
                $('#localScreenContainer').show();
            });
            // local screen removed
            webrtc.on('localScreenRemoved', function (video) {
                document.getElementById('localScreenContainer').removeChild(video);
                $('#localScreenContainer').hide();
            });

            // a peer video has been added
            webrtc.on('videoAdded', function (video, peer) {
                console.log('video added', peer);
                var remotes = document.getElementById('remotes');
                if (remotes) {
                    var container = document.createElement('div');
                    container.className = 'videoContainer';
                    container.id = 'container_' + webrtc.getDomId(peer);
                    container.appendChild(video);

                    // suppress contextmenu
                    video.oncontextmenu = function () { return false; };

                    // resize the video on click
                    video.onclick = function () {
                        container.style.width = video.videoWidth + 'px';
                        container.style.height = video.videoHeight + 'px';
                    };

                    // show the remote volume
                    

                    // show the ice connection state
                    if (peer && peer.pc) {
                        var connstate = document.createElement('div');
                        connstate.className = 'connectionstate';
                        container.appendChild(connstate);
                        peer.pc.on('iceConnectionStateChange', function (event) {
                            switch (peer.pc.iceConnectionState) {
                            case 'checking':
                                connstate.innerText = 'Connecting to peer...';
                                break;
                            case 'connected':
                            case 'completed': // on caller side
                                $(vol).show();
                                connstate.innerText = 'Connection established.';
                                break;
                            case 'disconnected':
                                connstate.innerText = 'Disconnected.';
                                break;
                            case 'failed':
                                connstate.innerText = 'Connection failed.';
                                break;
                            case 'closed':
                                connstate.innerText = 'Connection closed.';
                                break;
                            }
                        });
                    }
                    remotes.appendChild(container);
                }
            });
            // a peer was removed
            webrtc.on('videoRemoved', function (video, peer) {
                console.log('video removed ', peer);
                var remotes = document.getElementById('remotes');
                var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
                if (remotes && el) {
                    remotes.removeChild(el);
                }
            });


            // remote volume has changed
            webrtc.on('remoteVolumeChange', function (peer, volume) {
                showVolume(document.getElementById('volume_' + peer.id), volume);
            });

            // local p2p/ice failure
            webrtc.on('iceFailed', function (peer) {
                var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
                console.log('local fail', connstate);
                if (connstate) {
                    connstate.innerText = 'Connection failed.';
                    fileinput.disabled = 'disabled';
                }
            });

            // remote p2p/ice failure
            webrtc.on('connectivityError', function (peer) {
                var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
                console.log('remote fail', connstate);
                if (connstate) {
                    connstate.innerText = 'Connection failed.';
                    fileinput.disabled = 'disabled';
                }
            });

            // Since we use this twice we put it here
            function setRoom(name) {
                document.querySelector('form').remove();
                document.getElementById('title').innerText = 'Room: ' + name;
                document.getElementById('subTitle').innerText =  'Link to join: ' + location.href;
                $('body').addClass('active');
            }

            if (room) {
                setRoom(room);
            } else {
                $('form').submit(function () {
                    var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
                    webrtc.createRoom(val, function (err, name) {
                        console.log(' create room cb', arguments);

                        var newUrl = location.pathname + '?' + name;
                        if (!err) {
                            history.replaceState({foo: 'bar'}, null, newUrl);
                            setRoom(name);
                        } else {
                            console.log(err);
                        }
                    });
                    return false;
                });
            }

            var button = document.getElementById('screenShareButton'),
                setButton = function (bool) {
                    button.innerText = bool ? 'share screen' : 'stop sharing';
                };
            if (!webrtc.capabilities.screenSharing) {
                button.disabled = 'disabled';
            }
            webrtc.on('localScreenRemoved', function () {
                setButton(true);
            });

            setButton(true);

            button.onclick = function () {
                if (webrtc.getLocalScreen()) {
                    webrtc.stopScreenShare();
                    setButton(true);
                } else {
                    webrtc.shareScreen(function (err) {
                        if (err) {
                            setButton(true);
                        } else {
                            setButton(false);
                        }
                    });

                }
            };
	    }
	    else{
	    	alert("Doktori nuk eshte online");
	    }
    });
   
}