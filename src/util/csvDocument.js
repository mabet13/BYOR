import {csv} from "d3-fetch";
import ContentValidator from "./contentValidator";
import {extractFileName, searchBlipByParam} from "./util";
import {plotRadar} from "./factory";
import InputSanitizer from "./inputSanitizer";

export default class CsvDocument {
    constructor() {
        this.values = [
            {id: "1", name: "Update Salary",        ring: "dev",          quadrant: "People and Culture",  isNew: "true",  description: "Increase the salary of employees by 20%"},
            {id: "2", name: "Password Changer",     ring: "production",   quadrant: "IKEA IT",             isNew: "false", description: "This tool allows users to change the IKEA account password by themselves"},
            {id: "3", name: "Robotic Chat",         ring: "production",   quadrant: "IKEA IT",             isNew: "false", description: "Robotic chat with user to solve IT issues"},
            {id: "4", name: "Ultimate SAC",         ring: "test",         quadrant: "Retail",              isNew: "false", description: "This tool allows a robot to create a SAC in SAMS"},
            {id: "5", name: "Missing and Damaged",  ring: "deprecated",   quadrant: "Retail",              isNew: "false", description: "This tool allows a robot to create a SAC in SAMS"},
            {id: "6", name: "Automated car parking",   ring: "test",      quadrant: "Others",              isNew: "false", description: "Customers leave their cars at the entrance and a robot take the car to a parking slot"},
            {id: "7", name: "Orders Overview",      ring: "production",   quadrant: "Retail",              isNew: "false", description: "Does something that is helpful to someone"},
            {id: "8", name: "UAT - Cancellations",  ring: "production",   quadrant: "Retail",              isNew: "false", description: "Cancels it and it does it well"},
            {id: "9", name: "Connecting Sales",     ring: "production",   quadrant: "People and Culture",  isNew: "false", description: "Nokia: Connecting People"},
            {id: "10", name: "ACI Refund_Invoker",  ring: "production",   quadrant: "Retail",              isNew: "false", description: "Invokes the spirits of the Deads"}
        ];
        //this._url = url;
    }

    createBlips(queryParams) {
        let data = this.values;
        //let columnNames = ['id', 'name', 'ring', 'quadrant', 'isNew', 'description'];
        let blips = data;
        let graphingRadar = plotRadar('RPA Catalog', blips, 'CSV File', []);
        data.forEach(bl => bl.id = decodeURIComponent(bl.id.replace(/\+/g, ' ')));
        if (queryParams.search) {
            searchBlipByParam(graphingRadar, queryParams.search);
        };
        /*
        csv(this._url, {credentials: 'same-origin'})
            .then((data) => {
                try {
                    let columnNames = data['columns'];
                    delete data['columns'];
                    let contentValidator = new ContentValidator(columnNames);
                    contentValidator.verifyContent();
                    contentValidator.verifyHeaders();
                    let blips = new InputSanitizer().sanitize(data);
                    let graphingRadar = plotRadar(extractFileName(this._url), blips, 'CSV File', []);

                    data.forEach(bl => bl.id = decodeURIComponent(bl.id.replace(/\+/g, ' ')));
                    if (queryParams.search) {
                        searchBlipByParam(graphingRadar, queryParams.search);
                    }
                } catch (exception) {
                    throw exception;
                }
            });
        */
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    get data() {
        return this._data;
    }
}