import AWS, { EnvironmentCredentials } from 'aws-sdk'

const createCloudFormationSDK = async () => {
    if (!process.env.AWS_ACCESS_KEY_ID 
        && !process.env.AWS_SECRET_ACCESS_KEY) {

        console.error('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables must be set')
        process.exit(1)
    }

    try {
        return new AWS.CloudFormation({
            apiVersion: '2010-05-15',
            credentials: new EnvironmentCredentials('AWS')
        })
    } catch (e) {
        console.error('Could not create cloud formation SDK')
        process.exit(1)
    }
}

export {
    createCloudFormationSDK
}
