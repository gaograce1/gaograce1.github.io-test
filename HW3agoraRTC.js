let handlefail = function(err){
    console.log(err)
}


function addVideoStream(streamId){
    console.log()
    let remoteContainer = document.getElementById("pptStreams");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.className = "remoteStream";
    streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "150px"
    //streamDiv.style.justifySelf = "center";

    //streamDiv.style.display = "inline-block";
    remoteContainer.appendChild(streamDiv)

    let pptContainer = document.getElementById("newpptBox");
    let newppt = document.createElement("span");
    newppt.innerHTML = streamId;
    newppt.id = "newppt";
    pptContainer.appendChild(document.createElement("br"))
    pptContainer.appendChild(newppt);
    
} 

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "53ca517bfccd44f388878863903c1dc8";



    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    client.init(appId,() => console.log("AgoraRTC Client Connected"),handlefail)

    client.join(
        null,
        channelName,
        Username,
        () =>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function(){
                localStream.play("SelfStream")
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
                let pptContainer = document.getElementById("newpptBox");
                let newppt = document.createElement("span");
                newppt.innerHTML = Username;
                newppt.id = "newppt";
                pptContainer.appendChild(document.createElement("br"))
                pptContainer.appendChild(newppt);
            })
        }
    )

    client.on("stream-added", function (evt){
        console.log("Added Stream");
        client.subscribe(evt.stream,handlefail)
    })

    client.on("stream-subscribed", function(evt){
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId(), Username);  
        stream.play(stream.getId());
    })

}