# preamp

Generate aws-exports in your CI/CD for your AWS Amplify SDK Client

## Introduction

We often need some references to server endpoints from the client. This results mostly results in different build sequences depending on the environment we are targeting or plain hard-coding.

This approach mostly works, but does not scale well or requires too much aerobatics when you build in the cloud for every developer to different endpoints.

The amplify cli attempts to solve this with simple commands to switch environments. However it forces users to either go amplify all the way or not at all.

`preamp` allows you to have an elegant solution generating an `amplify sdk` client friendly `aws-exports.js` file that is generated from the cloudformation exports of the environment you run it in. This means you can easily mix an amplify client with 

## Usage

### Configure

The configuration allows you to setup some variables that are hard-coded and others that need to come from cloudformation exports.

```json
{
  "config": {
    "output": "src/aws-exports.js"
  },
  "fields": {
    "HardCoded": {"Value": "ORANGE"},
      "UserPool": {"Type": "cf", "Value": "UserPoolClient-Id"}
    }
  }
}
```

Just add a "Type"="cf" to any value you want in the export and specify the cloudformation export name.

The `profile` and the `output` can be configured under `config`.

#### cosmiconfig as part of your package.json

As part of your package.json file, you can specify a `preamp` section to configure.

#### Directory specific configuration with preamp.config.js

If a file called `preamp.config.js` is found in the current directory or a parent directory, it will be used to generate the `aws-exports.js` in the current directory.

### Run

The recommended way to run `preamp` is to use `npx`.

```shell
$ npx @roundtables/preamp
```

When running locally against a specific non-default AWS profile, use the `--profile parameter`:

```shell
$ npx @roundtables/preamp --profile <awsprofile>
```

## Troubleshooting

When running as part of CodeBuild or a Lambda, AWS sets the variables for AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_SESSION_TOKEN on your behalf. It will use the role setup for that construct.

### Cloudformation region is wrong

The region is automatically setup by CodeBuild/Lambda and defaults to the region they are running in. When run by hand locally, it will attach to the region defined in your `.aws/config`. 

You can override the region used by prepending `AWS_REGION=<region>` to the preamp command. An example would be:

```shell
AWS_REGION=ap-southeast-1 npx @roundtables/preamp
```

### Credentials are invalid

This happens when the credentials are setup incorrectly or that a session (from MFA for example) has expired. This mostly happens when run locally.

The best is to recreate the session details in your `.aws/credentials` so they have a new expiry time.

```output
Could not fetch cloudformation exports Error [CredentialsError]: Missing credentials in config, if using AWS_CONFIG_FILE, set AWS_SDK_LOAD_CONFIG=1
    at Request.extractError (.../preamp/node_modules/aws-sdk/lib/protocol/query.js:50:29)
...) {
  message: 'Missing credentials in config, if using AWS_CONFIG_FILE, set AWS_SDK_LOAD_CONFIG=1',
  code: 'CredentialsError',
  time: 2020-05-06T01:15:58.809Z,
  requestId: '3418e60d-794e-42ac-bba2-217fffd92fda',
  statusCode: 403,
  retryable: true,
  originalError: {
    message: 'Could not load credentials from SharedIniFileCredentials',
    code: 'CredentialsError',
    time: 2020-05-06T01:15:58.809Z,
    requestId: '3418e60d-794e-42ac-bba2-217fffd92fda',
    statusCode: 403,
    retryable: true,
    originalError: {
      message: 'The security token included in the request is expired',
      code: 'ExpiredToken',
      time: 2020-05-06T01:15:58.808Z,
      requestId: '3418e60d-794e-42ac-bba2-217fffd92fda',
      statusCode: 403,
      retryable: true
    }
  }
}
```

Another error you might get instead but with the same reason looks like this:

```
Could not merge cloudformation exports Error [ConfigError]: Missing region in config
    at Request.VALIDATE_REGION (.../preamp/node_modules/aws-sdk/lib/event_listeners.js:92:45)
}
```

## Contributing

This is a first version to get things done. Testing and refactoring are still needed. There can be a great number of improvements to the error messaging.

We would like to keep the simplicity/value-add of this tool maximized. If you have any contribution ideas or contributions, that keep a great simplicity/value-add ratio, use the github issues and pull requests to support the project.
