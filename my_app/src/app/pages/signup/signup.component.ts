import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  myform: FormGroup;
  submit: boolean = false;
  valid: boolean = false;
  pattern: boolean;
  length: boolean;
  constructor(private router: Router, private fb: FormBuilder, private service: DataService) {

  }
  // this.myform =this.fb.group({
  //   firstname: ['',[Validators.required]],
  //   email: new FormControl('',Validators.required),
  //   password: new FormControl('',Validators.required),
  //   mobile: new FormControl('',Validators.required),
  //   address: new FormControl('',Validators.required),
  //   confirm: new FormControl('',Validators.required),
  // })
  ngOnInit(): void {
    this.service.getdata().subscribe((data) => {
      console.log(data);
    });
    this.myform = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      mobile: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(4)]],
      confirm: ['', [Validators.required, Validators.minLength(4)]],
    })
  }

  onSubmit() {

    this.submit = true;
    console.log(this.myform);
    console.log(this.myform.get('firstname'));
    // console.log(this.myform.value.password == this.myform.value.confirm);
    if (this.myform.value.mobile.trim() != "" && !(/^-?(0|[1-9]\d*)?$/.test(this.myform.value.mobile.trim()))) {
      //alert();
      this.pattern = true;
    } else {
      this.pattern = false;
    }
    if (this.myform.value.mobile.trim() != "" && (/^-?(0|[1-9]\d*)?$/.test(this.myform.value.mobile.trim())) && this.myform.value.mobile.trim().length != 10) {
      this.length = true;
    } else {
      this.length = false;
    }
    if (this.myform.valid && (this.myform.value.password == this.myform.value.confirm)) {
      this.service.senddata(this.myform.value).subscribe((data) => {
        console.log(data);
        if (data == "success") {
          this.router.navigateByUrl("/login");
        } else {
          alert(data)
        }
      })
    } else {
      alert("form is invalid")
    }

  }
}
