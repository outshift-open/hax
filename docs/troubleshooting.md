# Troubleshooting

## Build Job Not Triggering
If your new app repo was **not** created in the [eti-playground org](https://wwwin-github.cisco.com/eti-playground), you must configure the repo as described below for an automated CI/CD pipeline:
* Create a webhook:
    * **Payload URL**: `https://engci-private-sjc.cisco.com/jenkins/eti-sre/github-webhook/`
    * **Content type**: `application/x-www-form-urlencoded`
    * **Secret**: _leave blank_
    * **SSL verifcation**: `Enable SSL verification`
    * **Which events would you like to trigger this webhook?**: `Send me everything.`
    * **Active**: _ensure it is checked_ 
* Add the `eti-sre-cicd.gen -X` user as a collaborator to your repo.
