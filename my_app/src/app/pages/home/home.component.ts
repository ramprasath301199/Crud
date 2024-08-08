import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as forms from '@angular/forms';
import { NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  profileForm: forms.FormGroup;
  datas: any[] = [];
  result: any;
  getId: any;
  update: boolean = false;
  user: string;
  constructor(private service: DataService, private router: Router) {
  }
  ngOnInit(){
    //alert();
    var token = localStorage.getItem("token");
    if (!token) {
      this.router.navigateByUrl("/login");
    } else {
      var username = localStorage.getItem("name");
      this.user = username;
    }
    this.service.getdetails().subscribe((data: any) => {
      this.datas = data;
      console.log(data);
    },(error)=>{});
    this.profileForm = new forms.FormGroup({
      name: new forms.FormControl('', [Validators.required]),
      LastName: new forms.FormControl('', [Validators.required]),
      Mobile: new forms.FormControl('', [Validators.required]),
      Address: new forms.FormControl('', [Validators.required]),
    });
  }
  getdet(id) {
    this.update = true;
    this.getId = id;
    this.result = this.datas.find(o => o.Id == id);
    console.log(this.result);
    //var name = document.getElementById("name");
    // name.nodeValue = this.result.name;
    this.profileForm.get("name").setValue(this.result.name);
    this.profileForm.get("LastName").setValue(this.result.LastName);
    this.profileForm.get("Mobile").setValue(this.result.Mobile);
    this.profileForm.get("Address").setValue(this.result.Address);
    console.log(this.profileForm.value);
  }
  onSubmit(form) {
    console.log(form);
    if (!form.valid) {
      alert("Form Is Invalid");
    }
    else if (form.valid && this.update) {
      this.service.update(form.value, this.getId).subscribe((data) => {
        console.log(data);
        if (data) {
          this.closeModal.nativeElement.click();
          window.location.reload();
        }
      });
    } else {
      this.service.createuser(form.value).subscribe((data) => {
        console.log(data);
        if (data) {
          this.closeModal.nativeElement.click();
          window.location.reload();
        }
      })
    }
  }
  delete(id) {
    this.service.delete(id).subscribe(data => {
      console.log(data);
      if (confirm("Are You Want To Delete") == true) {
        if (data == "success") {
          window.location.reload();
        }
      } else {
        console.log("canceled");
      }
    })
  }
  logout() {
    localStorage.removeItem("token");
    this.router.navigateByUrl("/login");
  }
}
