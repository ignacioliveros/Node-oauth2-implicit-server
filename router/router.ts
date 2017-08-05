// This code belongs to DanWahlin,
// you can find the original here https://github.com/DanWahlin/Angular-NodeJS-MongoDB-CustomersService/blob/master/src/routes/router.js
// I just made a few changes to make it work with Typescript.
// This Class loops through all the ./Controller subfolders and creates routes on the fly.

import { Application, Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class Routes {

    private startFolder: string;
    public load(app: Application, folderName: string) {

        if (!this.startFolder) {
            this.startFolder = path.basename(folderName);
        }

        fs.readdirSync(folderName).forEach((file) => {

            const fullName = path.join(folderName, file);
            const stat = fs.lstatSync(fullName);

            if (stat.isDirectory()) {
                // Recursively walk-through folders
                this.load(app, fullName);
            } else if (file.toLowerCase().indexOf('.ts') > - 1) {
                // Grab path to JavaScript file and use it to construct the route
                const dirs = path.dirname(fullName).split(path.sep);
                if (dirs[0].toLowerCase() === this.startFolder.toLowerCase()) {
                    dirs.splice(0, 1);
                }
                const router = Router();
                const pathNoExt = fullName.substring(0, fullName.lastIndexOf('.'));

                // Generate the route
                const baseRoute = '/' + dirs.join('/');
                console.log('Created route: ' + baseRoute + ' for ' + fullName);

                // Load the JavaScript file ('controller') and pass the router to it
                const route = require('../' + pathNoExt);

                const routeClass = Object.getOwnPropertyNames(route)[1];
                // Create an instance of each controller class
                const routeInit = new route[routeClass](router);
                // Associate the route with the router
                app.use(baseRoute, router);
            }
        });
    }
}
