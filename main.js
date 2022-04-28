img = "";
Status = "";
Objects = [];
let alarm;

function preload()
{
    //alarm = loadSound('alarm.mp3');
    alarm = createAudio('alarm.mp3');
}

function soundLoaded(){
 console.log('The sound is loaded');
}

function setup()
{
    console.log("In Setup function");
    canvas = createCanvas(380, 380);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(380, 380);
    video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting Oblects";
    console.log("Setup Complete");
}

function modelLoaded()
{
    console.log("Model Loaded");
    Status = true;
    objectDetector.detect(video, gotResult);
}

function draw()
{
    image(video, 0, 0, 380, 380);

     if (Status != "")
     {
         r = random(255);
         g = random(255);
         b = random(255);
         objectDetector.detect(video, gotResult);
         if (Objects.length == 0)
        {
            document.getElementById("status").innerHTML = "Baby Is Not Detected";
            alarm.play();
        }
        else 
        {
            var babyDetected = false;
            for(i = 0; i < Objects.length; i++)
            {
                document.getElementById("status").innerHTML = "Status : Object Detected";
                document.getElementById("number_of_objects").innerHTML = "Number of Objects detected are : " + Objects.length;

                fill(r,g,b);
                percent = floor(Objects[i].confidence * 100 );
                text(Objects[i].label + "" + percent + "%", Objects[i].x + 15, Objects[i].y + 15);
                noFill();
                stroke(r,g,b);
                rect(Objects[i].x, Objects[i].y, Objects[i].width, Objects[i].height);
                if (Objects[i].label == "person")
                {
                    babyDetected = true;
                    break;
                }                                   
            }
            if (babyDetected == true)
            {
                document.getElementById("status").innerHTML = "Baby Is Detected";
                alarm.stop();
            }
            else
            {
                document.getElementById("status").innerHTML = "Baby Is Not Detected";
                alarm.play();
            }
        }
     }
}

function gotResult(error, results)
{
    if(error)
    {
        console.log(error);
    }
    else
    {
        console.log(results);
        Objects = results;
    }
}