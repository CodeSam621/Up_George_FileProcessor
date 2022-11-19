const axios = require('axios');
const aws = require('aws-sdk');
aws.config.update({region:'us-east-1'});

const dynamoDB = new aws.DynamoDB.DocumentClient();
let response;

const API_URL = 'https://jsonplaceholder.typicode.com/posts/1';
const DYNAMODB_TABLE_NAME = 'FileProcessingInfo'

exports.fileProcessorHandler = async (event, context) => {
    try {       
        console.log('event', event);  

        for(const rec of event.Records) {
            console.log('rec:', rec)

             // call third party api
            const apiResult  = await callAPI(rec.address);
            if(!apiResult.success){
                return {
                    'statusCode': 500,
                    'body': JSON.stringify({
                        message: 'API error. Please check the logs',
                    })
                }
            }

            // save the result to dynamoDB
            await saveToDatabase(rec.name, apiResult);
        }
        
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'The message processed successfully',
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

const callAPI =  async (url) => {
    let result = {};
    await axios.get(url)
    .then(function(response){
        if(response?.status === 200){
            console.log('data', response.data);
            result =  { success: true, data: response.data} ;
        }
        else {
            console.log(`Error: ${response.status}, ${response}`);   
            result =  { success: false} ;  
        }       
    })
    .catch((err)=> {
        console.log('ERROR:', err)
        result =  { success: false} ;
    })

    return result;
}

const saveToDatabase =  async (name, apiResult) => {
    const params = {
        TableName : DYNAMODB_TABLE_NAME,
        Item : {
            MessageId: name,
            APIResult: JSON.stringify(apiResult),
            Updated: new Date().toUTCString()
        }
    };

    await dynamoDB.put(params).promise();    
}


/// the function which listens the S3 bucket and create message in SQS
exports.sendMessageToSQSHandler = async (event, context) => {
    try {       
        console.log('event', event);

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'sending message to SQS',
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
