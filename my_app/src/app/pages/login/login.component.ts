import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  password: boolean = true;
  firstname: boolean = true;
  constructor(private router: Router,private service:DataService) {
  }
  onSubmit(form: NgForm) {
    // alert();
    console.log(form.value.name);
    if (form.value.name == "") {
      this.firstname = false;
    }else if(form.value.name != "" && form.value.name.length <3){
      this.firstname = false;
      document.getElementById("name").innerHTML="! invalid username";
    }else{
      this.firstname = true;
    }
    if (form.value.password == "") {
      this.password = false;
    }else {
      this.password = true;
    }
    if(form.valid){
    this.service.login(form.value).subscribe((data)=>{
      console.log(JSON.parse(data));
      var json = JSON.parse(data);
      if(data){
        localStorage.setItem("token",json[0].token);
        localStorage.setItem("name",json[0].name);
        this.router.navigateByUrl("/home");
      }

    })
    }
  }

}
