import { Component, HostBinding } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors
} from "@angular/forms";
import { Observable } from "rxjs/Observable";

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  formGroup: FormGroup;
  titleAlert: string = "This field is required";
  post: any = "";

  foods: Food[] = [
    { value: "steak-0", viewValue: "Steak" },
    { value: "pizza-1", viewValue: "Pizza" },
    { value: "tacos-2", viewValue: "Tacos" }
  ];

  constructor(private formBuilder: FormBuilder) {}

  @HostBinding('class') class: string += 'aaaaaaaaaa';

  ngOnInit() {
    this.createForm();
    this.setChangeValidate();
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(emailregex)],
        this.checkInUseEmail
      ],
      food: [
        null,
        [Validators.required,
        (control: FormControl): ValidationErrors => {
          return control.value === this.foods[0].value ? { invalid: true } : null;
          }]
      ],
      name: [null, Validators.required],
      password: [null, [Validators.required, this.checkPassword]],
      description: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(10)]
      ],
      validate: ""
    });
    window['_form'] = this.formGroup;
  }

  setChangeValidate() {
    this.formGroup.get("validate").valueChanges.subscribe(validate => {
      if (validate == "1") {
        this.formGroup
          .get("name")
          .setValidators([Validators.required, Validators.minLength(3)]);
        this.titleAlert = "You need to specify at least 3 characters";
      } else {
        this.formGroup.get("name").setValidators(Validators.required);
      }
      this.formGroup.get("name").updateValueAndValidity();
    });
  }

  get name() {
    return this.formGroup.get("name") as FormControl;
  }

  checkPassword(control) {
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return !passwordCheck.test(enteredPassword) && enteredPassword
      ? { requirements: true }
      : null;
  }

  checkInUseEmail(control) {
    // mimic http database access
    let db = ["tony@gmail.com"];
    return new Observable(observer => {
      setTimeout(() => {
        let result =
          db.indexOf(control.value) !== -1 ? { alreadyInUse: true } : null;
        observer.next(result);
        observer.complete();
      }, 4000);
    });
  }

  getErrorEmail() {
    return this.formGroup.get("email").hasError("required")
      ? "Field is required"
      : this.formGroup.get("email").hasError("pattern")
      ? "Not a valid emailaddress"
      : this.formGroup.get("email").hasError("alreadyInUse")
      ? "This emailaddress is already in use"
      : "";
  }

  getErrorPassword() {
    return this.formGroup.get("password").hasError("required")
      ? "Field is required (at least eight characters, one uppercase letter and one number)"
      : this.formGroup.get("password").hasError("requirements")
      ? "Password needs to be at least eight characters, one uppercase letter and one number"
      : "";
  }

  onSubmit(post) {
    this.post = post;
  }
}
