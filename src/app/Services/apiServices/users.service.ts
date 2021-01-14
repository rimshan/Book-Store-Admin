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
export class UsersService {

    private url: string;
    private mockUrl: string;

    constructor(private http: HttpClient,  private token: TokenStorage) {
        this.url =   API_URL + "/";
    }



    getUsers() {
      const httpOptions = {
          headers: new HttpHeaders({
              "Content-Type": "application/json",
              Authorization: "Bearer " + this.token.getToken()
          })
      };
      return this.http.get(this.url + "users", httpOptions);
  }

  updateUser(user, id) {
    const httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token.getToken()
        })
    };
    return this.http.put(this.url + `user/${id}`, user, httpOptions);
}



}
