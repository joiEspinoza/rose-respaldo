import AWS from 'aws-sdk';
import ReactS3Uploader from 'react-s3-uploader';


{/*
var bucketName = 'rosev0';
var bucketRegion = 'us-east-2';
var IdentityPoolId = 'us-east-2:38d700f2-c99b-4c9e-9686-6ce21337d610';

AWS.config.region = bucketRegion; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: IdentityPoolId,});


const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: bucketName}
});*/}
//encodeURIComponent()

AWS.config.update({
  region : 'us-east-2',
  accessKeyId: 'AKIA5XKDKZ4KRSBLKVGI',
  secretAccessKey: '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',
});


console.log("AWS",AWS);
const s3 = new AWS.S3({
 accessKeyId: 'AKIAI4IYUCNFNIWHMB4Q',
 secretAccessKey: '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',
 Bucket: 'rosev0'
});

const uploadFile1 = (file,ruta) => {

s3.upload({
        Key: ruta,
        Bucket: 'rosev0',
        Body: file,
        ACL: 'public-read'
        }, function(err, data) {
        if(err) {
        console.log('error s3',err,data);
        }
        alert('Successfully Uploaded!');
        }).on('httpUploadProgress', function (progress) {
        var uploaded = parseInt((progress.loaded * 100) / progress.total);
        console.log(uploaded);
      });
}

const uploadFile22 = (file,ruta) => {
  
  
  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: 'rosev0',
      Key: ruta,
      Body: file,
      ACL: "public-read"
    }
  });

  var promise = upload.promise();

  promise.then(
    function(data) {
      alert("Successfully uploaded photo.");
    },
    function(err) {
      return alert("There was an error uploading your photo: ", err.message);
    }
  );
  
}

const uploadFile12 = (file,ruta) => {
  var params = {
    Bucket: 'rosev0',
    Key: ruta,
    Expires: 60,
    ContentType: file.type,
    ACL: "public-read"
  };
  s3.getSignedUrl('putObject', params, function(err, signedUrl){
     if (err) {
          console.log("error papi",err);
          return err;
      } else {
          console.log("Exito papi",signedUrl);

          var instance = axios.create();
          var confi = {
            headers: {
              'Content-Type': file.type,
              'Access-Control-Allow-Origin': 'https://localhost:3000',
            }
          }

          instance.put(signedUrl, file, confi)
              .then(function (result) {
                  console.log(result);
              })
              .catch(function (err) {
                  console.log(err);
              });
          return signedUrl;
      }
  });
  
  
}