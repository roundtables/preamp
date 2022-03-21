import AWS, { SsoCredentials, EnvironmentCredentials } from 'aws-sdk'
import { STSClient } from '@aws-sdk/client-sts';
import { fromSSO } from '@aws-sdk/credential-providers';

const createCloudFormationSDK = async (passedProfile) => {
    if (!process.env.AWS_ACCESS_KEY_ID 
        && !process.env.AWS_SECRET_ACCESS_KEY
        && !process.env.AWS_SESSION_TOKEN) {

        if (passedProfile) {
            try {
                const stsClient = new STSClient({
                    credentials: fromSSO({
                      profile: passedProfile,
                    }),
                    region: process.env.AWS_REGION,
                  });
                const credentials = await stsClient.config.credentials();    
                AWS.config.update({ credentials })
            } catch (e) {
                console.error('Could not use profile', passedProfile)
                process.exit(1)
            }            
        }
    }

    try {
        return new AWS.CloudFormation({
            apiVersion: '2010-05-15',
        })
    } catch (e) {
        console.error('Could not create cloud formation SDK')
        process.exit(1)
    }
}

export {
    createCloudFormationSDK
}
