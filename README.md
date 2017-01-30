# Swagger Pets Api

## Writing Tests

1. Run `npm run develop:test:record`. This will log any http requests to terminal. Save them in `test/nock/{operationId}.json`.
2. Run `npm run generate:tests`. This will scaffold your necessary tests. It will fail if you are missing a test.
3. Implement your generated tests `npm run develop:test`.

## Edit swagger file locally

In order to edit the API's swagger file locally you should:

* Download the Swagger UI engine, there are two options:
    * Yo could go to [this repository](https://github.com/swagger-api/swagger-editor) and follow instructions to download and run the project.
    * Download the Swagger UI (v2.10.4) [directly here](https://github.com/swagger-api/swagger-editor/releases/download/v2.10.4/swagger-editor.zip).
* Navigate to the directory where the Swagger UI engine has been downloaded.
* Run a static file web server to expose the files on the Swagger UI's folder:
    * You may want to try [superstatic](https://github.com/firebase/superstatic):
        * In the console type `sudo npm install -g superstatic`.
        * Then inside the Swagger UI's folder console type `superstatic`.
        * By default the Swagger UI could be reached at `http://localhost:3474`.
* On the Swagger UI' interface select **file** -> **import file** -> select the file on **src/api/swagger/api-definition.yml**.
