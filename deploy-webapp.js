const {execSync} = require('child_process');
const path = require('path');

function getArgument( name, defaultValue ) {
  let matched = false;
  for ( let arg of process.argv ) {
    console.log( arg );
    if ( arg === name ) {
      matched = true;
      continue;
    }
    if ( matched ) {
      return arg;
    }
  }
  
  return defaultValue;
}

/**
 * This file fishes out the bucket name created using the Cloud Formation template
 * and then runs a command line script that synchronizes the contents of ./web
 * into that bucket, setting permissions to public
 */

(function() {
  let askStates;
  try {
    askStates = require( path.resolve('.', '.ask', 'ask-states.json') );
  } catch (err) {
    throw new Error("failed to load ask-states.json Have you successfully executed ask deploy yet?");
  }
  
  const profile = askStates.profiles.default;
  if ( !profile ) {
    throw new Error("failed to obtain profile object. Did you specify the right one?");
  }
   
  const infrastructure = profile.skillInfrastructure;
  if ( !infrastructure ) {
    throw new Error("failed to obtain skillInfrastructure object. Have you successfully executed ask deploy yet?");
  }
  
  const cfn = infrastructure['@ask-cli/cfn-deployer'];
  if ( !cfn ) {
    throw new Error("failed to obtain the @ask-cli/cfn-deployer object. Is this skill configured to use CloudFront?");
  }
  
  let outputs;
  try {
    outputs = cfn.deployState.default.outputs;
  } catch {}
  if ( !outputs ) {
    throw new Error("No CloudFormation outputs found, check the developer console for potential CloudFormation errors.");
  }
  
  let bucketName;
  outputs.forEach(output => {
    if ( output.OutputKey === 'WebAppBucketName' ) {
      bucketName = output.OutputValue;
    }
  });
  if (!bucketName) {
    throw new Error("Did not find the outputs WebAppBucketName. Did you modify the CloudFormation file?")
  }

  const profileName = getArgument( '-p', 'default' );
  
  console.log( `==================== Deploy S3 Web App ====================` );
  console.log( `found bucket from CloudFormation: ${bucketName}, starting deployment to AWS profile ${profileName}` );
  
  try {
    execSync(`aws s3 sync ./web s3://${bucketName} --cache-control "no-cache" --acl public-read --dryrun --profile ${profileName}`, {stdio:'inherit'});
  } catch (err) {
    console.error(`s3 deployment failed, see output above for details. If aws cli could not locate credentials, do you have a valid default profile? If not, did you mean to run this script with the -p flag to specify a non default one?`);
    return;
  }

  console.log( `s3 deployment complete`);
})()
