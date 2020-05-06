import AWS from 'aws-sdk'

const createCloudFormationSDK = async (passedProfile) => {
    if (!process.env.AWS_ACCESS_KEY_ID 
        && !process.env.AWS_SECRET_ACCESS_KEY
        && !process.env.AWS_SESSION_TOKEN) {

        if (passedProfile) {
            try {
                var credentials = new AWS.SharedIniFileCredentials({profile: passedProfile});
                AWS.config.update({ credentials })
            } catch (e) {
                console.error('Could not use profile', passedProfile)
                process.exit(1)
            }            
        }
    }

    try {
        return new AWS.CloudFormation({ apiVersion: '2010-05-15' })
    } catch (e) {
        console.error('Could not create cloudformation SDK')
        process.exit(1)
    }
}

export {
    createCloudFormationSDK
}
