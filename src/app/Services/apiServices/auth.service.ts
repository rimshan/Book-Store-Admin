import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpEvent, HttpEventType } from "@angular/common/http";
import { API_URL } from "../../../configurations";
import { TokenStorage } from "../../shared/auth/token-storage";
// import { Signup } from "../../models/signup.model";
// import { User } from "../../models/user.model";
// import {GlobleService} from  "./globle.service";
// import { Observable } from "rxjs/Observable";
// import { forkJoin } from "rxjs/observable/forkJoin";




@Injectable({
    providedIn: "root"
})
export class AuthService {

    private url: string;
    private mockUrl: string;

    constructor(private http: HttpClient,  private token: TokenStorage) {
        this.url =   API_URL + "/";
    }



    adminLogin(username, password) {

      const data = {
        "username" : username,
        "password" : password
      }
        const httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "X-Skip-Interceptor": "",
                Authorization: "Basic " + btoa(username + ":" + password)
            })
        };
        return this.http.post(this.url + "admin/auth/login", data);
    }

    adminLogout(){
      const httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
            "X-Skip-Interceptor": "",
            Authorization: "Basic "
        })
    };
      return this.http.get(this.url + "admin/auth/logout", httpOptions);
    }



}
