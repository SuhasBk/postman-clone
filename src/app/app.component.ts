import { Component, ElementRef } from '@angular/core';
import { RestService } from './rest.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'postman-clone';
    fieldCountArray: Array<number>;
    headerFieldCount: number;
    headerJson: Object = {};
    bodyJson: Object = {};
    doc: any;
    response: any = '';
    requestMethod: any;
    requestUrl: any;
    error: any;

    constructor(private element: ElementRef, private restService: RestService) {
        this.doc = this.element.nativeElement;
        this.headerFieldCount = 2;
        this.fieldCountArray = new Array<number>(this.headerFieldCount);
    }

    setFieldCount = () => {
        if(this.headerFieldCount >= 1 && this.headerFieldCount <= 6)
            this.fieldCountArray = new Array<number>(this.headerFieldCount);
    }

    buildHeaderJson = (headerJsonTable) => {
        this.headerJson = new Object();      
        for (let i = 1; i <= this.headerFieldCount; i++) {
            let key = headerJsonTable.querySelector(`.key_${i}`).value;
            let value = headerJsonTable.querySelector(`.value_${i}`).value;

            if (!this.headerJson.hasOwnProperty(key)) {
                delete this.headerJson[key];
            }

            if (key !== '' && value !== '') {
                this.headerJson[key] = value;
                this.doc.querySelector('#headers').textContent = JSON.stringify(this.headerJson, undefined, 2);
            }
        }
    }

    buildBodyJson = (bodyJsonString) => {
        try {
            this.bodyJson = JSON.parse(bodyJsonString.value);
            this.doc.querySelector('#body').textContent = JSON.stringify(this.bodyJson, undefined, 2);
        } catch (error) {
            if(confirm('The payload entered is not in JSON format. Please refer this link for rules:\n\nhttps://www.w3schools.com/js/js_json_syntax.asp')) {
                window.open('https://www.w3schools.com/js/js_json_syntax.asp');
            }
        }
    }

    perform = () => {
        this.error = undefined;
        let proxyBody = {
            'URL': this.requestUrl,
            'HEADERS': this.headerJson,
            'BODY': this.bodyJson,
            'METHOD': this.requestMethod
        };

        this.restService.performProxyRequest(proxyBody).subscribe((response) => {
            this.response = response;
            this.doc.querySelector('.mat-tab-labels').children[2].click();
        }, err => {
            this.error = err.error['ERROR'] ? err.error['ERROR'] : err.status + ' ' +err.statusText;
            console.log(err, this.error);
        })
    }
}
