import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  //  public API = "https://viratram3011.onrender.com/"
  public API = "http://localhost:3011/"
  constructor(private http: HttpClient) { }
  headers = new HttpHeaders({ 'Content-Type': 'application/json', "authorization": "Bearer " + localStorage.getItem('token') })
  httpOptions = {
    headers: this.headers
  };
  senddata(myform) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(this.API + "signup", [{ "name": myform.firstname, "email": myform.email, "mobile": myform.mobile, "password": myform.password, "address": myform.address }], { responseType: 'text', headers: headers })
  }
  getdata() {
    return this.http.get(this.API, { responseType: "text" });
  }
  login(myform) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(this.API + "login", [{ "name": myform.name, "password": myform.password }], { responseType: 'text', headers: headers })
  }
  getdetails(): Observable<any> {
    return this.http.get<any>(this.API + "details", { headers: this.headers });
  }
  update(myform, id: number) {
    return this.http.post(this.API + "update", { "name": myform.name, "Mobile": myform.Mobile, "Address": myform.Address, "LastName": myform.LastName, "Id": id }, { responseType: 'text', headers: this.headers })
  }
  createuser(myform) {
    return this.http.post(this.API + "newdata", [{ "name": myform.name, "Mobile": myform.Mobile, "Address": myform.Address, "LastName": myform.LastName }], { responseType: 'text', headers: this.headers })
  }
  delete(id) {
    return this.http.post(this.API + "delete", { "Id": id }, { responseType: 'text', headers: this.headers })
  }
}
